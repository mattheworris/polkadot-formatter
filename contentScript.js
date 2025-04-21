// Content script to format token amount inputs on Polkadot.js UI with underscores for readability
(function() {
    'use strict';

    // Helper: format a numeric string by inserting underscores as thousand separators [oai_citation_attribution:0‡stackoverflow.com](https://stackoverflow.com/questions/2254185/regular-expression-for-formatting-numbers-in-javascript#:~:text=)
    function formatWithUnderscores(numStr) {
        // Only format purely numeric strings (to avoid altering addresses or other fields)
        if (!/^\d+$/.test(numStr)) {
            return numStr;
        }
        // Insert underscores between every 3 digits from the right (e.g. "1000000" -> "1_000_000")
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '_');
    }

    // Map to track inputs that have been enhanced
    const formattedInputs = new WeakMap();

    // Set up an individual input field for formatting
    function setupInput(input) {
        console.log('Setting up formatting for input:', input);
        if (formattedInputs.has(input)) {
            return; // Already set up
        }
        // Create an overlay span to display the formatted value
        const overlay = document.createElement('span');
        overlay.style.position = 'absolute';
        overlay.style.pointerEvents = 'none';       // Let clicks pass through to the actual input
        overlay.style.whiteSpace = 'pre';           // Preserve spacing as typed
        overlay.style.overflow = 'hidden';          // Avoid text overflow outside input bounds

        // Copy text styles from the input to the overlay to ensure identical appearance
        const inputStyle = window.getComputedStyle(input);
        overlay.style.fontFamily = inputStyle.fontFamily;
        overlay.style.fontSize = inputStyle.fontSize;
        overlay.style.fontWeight = inputStyle.fontWeight;
        overlay.style.lineHeight = inputStyle.lineHeight;
        overlay.style.letterSpacing = inputStyle.letterSpacing;
        overlay.style.padding = inputStyle.padding;
        overlay.style.margin = inputStyle.margin;
        overlay.style.height = inputStyle.height;
        overlay.style.width = inputStyle.width;
        overlay.style.top = inputStyle.offsetTop + 'px';
        overlay.style.left = inputStyle.offsetLeft + 'px';
        overlay.style.height = inputStyle.offsetHeight + 'px';
        overlay.style.width = inputStyle.offsetWidth + 'px';
        overlay.style.left = inputStyle.paddingLeft;
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';        // Center vertically
        overlay.style.paddingLeft = window.getComputedStyle(input).paddingLeft;
        overlay.style.paddingRight = window.getComputedStyle(input).paddingRight;
        overlay.style.boxSizing = 'border-box'; // Ensure padding is included in width/height calculations
        overlay.style.backgroundColor = 'transparent'; // Make background transparent
        overlay.style.color = 'rgba(0, 0, 0, 0.7)'; // Make text color transparent

        // Ensure the input’s container is positioned (for correct absolute positioning of overlay)
        let container = input.parentElement;
        if (container) {
            const containerStyle = window.getComputedStyle(container);
            if (containerStyle.position === 'static') {
                container.style.position = 'relative';
            }
        } else {
            container = document.body;
        }
        container.appendChild(overlay);

        // Make the input text transparent but keep the caret visible
        input.style.color = 'transparent';
        input.style.caretColor = inputStyle.color;

        // Update the overlay text to the formatted value
        function updateOverlay() {
            const rawValue = input.value;
            // If empty or not numeric, show nothing
            if (!rawValue || !/^\d+$/.test(rawValue)) {
                overlay.textContent = rawValue;
            } else {
                console.log('Updating overlay. Raw value:', rawValue, 'Formatted:', formatWithUnderscores(rawValue));
                overlay.textContent = formatWithUnderscores(rawValue);
            }
        }

        // Attach event listeners to keep the overlay in sync
        input.addEventListener('input', updateOverlay);
        input.addEventListener('focus', updateOverlay);
        input.addEventListener('blur', updateOverlay);

        // Initial formatting update
        updateOverlay();

        // Mark this input as set up
        formattedInputs.set(input, { overlay: overlay });
    }

    // Initial scan: find existing relevant inputs (likely token amount fields)
    const candidateInputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    candidateInputs.forEach(input => {
        // Heuristic: if input’s current value or placeholder has a long digit string (6 or more digits),
        // it is likely a token amount field that could benefit from formatting.
        const sampleText = input.value || input.placeholder || "";
        if (/\d{6,}/.test(sampleText)) {
            setupInput(input);
        } else {
            // If not initially long, watch for user input that becomes long
            input.addEventListener('input', function onInitialInput(e) {
                if (/\d{6,}/.test(input.value)) {
                    setupInput(input);
                    input.removeEventListener('input', onInitialInput);
                }
            });
        }
    });

    // MutationObserver: watch for new input fields added dynamically (SPA navigation or UI updates)
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            console.log('Mutation observed. Added nodes:', mutation.addedNodes);
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {  // Element node
                    // If the added node itself is an input
                    if (node.matches('input[type="text"], input[type="number"]')) {
                        const input = node;
                        const sampleText = input.value || input.placeholder || "";
                        if (/\d{6,}/.test(sampleText)) {
                            setupInput(input);
                        } else {
                            // Attach one-time listener to catch if user later inputs a large number
                            input.addEventListener('input', function onInitialInput(e) {
                                if (/\d{6,}/.test(input.value)) {
                                    setupInput(input);
                                    input.removeEventListener('input', onInitialInput);
                                }
                            });
                        }
                    }
                    // If the added node contains inner inputs (e.g., a form section)
                    if (node.querySelectorAll) {
                        const innerInputs = node.querySelectorAll('input[type="text"], input[type="number"]');
                        innerInputs.forEach(subInput => {
                            const sampleText = subInput.value || subInput.placeholder || "";
                            if (/\d{6,}/.test(sampleText)) {
                                setupInput(subInput);
                            } else {
                                subInput.addEventListener('input', function onInitialInput(e) {
                                    if (/\d{6,}/.test(subInput.value)) {
                                        setupInput(subInput);
                                        subInput.removeEventListener('input', onInitialInput);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();