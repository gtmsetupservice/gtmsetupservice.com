// FluentCRM Form Handler for GTM Setup Services
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gtm-contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    // Extract UTM parameters on page load
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('utm_source').value = urlParams.get('utm_source') || '';
    document.getElementById('utm_medium').value = urlParams.get('utm_medium') || '';
    document.getElementById('utm_campaign').value = urlParams.get('utm_campaign') || '';

    // Form submission handler
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting...';

            // Hide previous messages
            successMsg.classList.add('hidden');
            errorMsg.classList.add('hidden');

            // Collect form data
            const formData = new FormData(form);
            const data = {};

            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Prepare payload for Pipedream webhook
            const payload = {
                email: data.email,
                name: data.name,
                phone: data.phone,
                website: data.website,
                problem: data.problem,
                details: data.details || '',
                service_type: data.service_type,
                source_domain: data.source_domain,
                utm_source: data.utm_source || '',
                utm_medium: data.utm_medium || '',
                utm_campaign: data.utm_campaign || '',
                form_submitted: new Date().toISOString()
            };

            let errorType = 'network_error';

            try {
                // Send to Pipedream webhook
                const response = await fetch('https://eocrrf0lm1scxwv.m.pipedream.net', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    window.dataLayer = window.dataLayer || [];
                    dataLayer.push({
                        'event': 'form_submission',
                        'form_name': 'gtm_contact_form',
                        'service_type': 'gtm',
                        'problem_type': data.problem,
                        'conversion_value': 397,
                        'utm_source': data.utm_source || '',
                        'utm_medium': data.utm_medium || '',
                        'utm_campaign': data.utm_campaign || '',
                        'page_referrer': document.referrer
                    });

                    // Show success message
                    successMsg.classList.remove('hidden');
                    form.reset();
                } else {
                    errorType = 'server_error';
                    throw new Error('Form submission failed');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                errorMsg.classList.remove('hidden');

                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    'event': 'form_error',
                    'error_type': errorType
                });
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Contact GTM Expert';
            }
        });
    }

    // Track form interactions
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_field_focus', {
                    'field_name': this.name,
                    'form_name': 'gtm_contact_form'
                });
            }
        });
    });

    // Track page scroll depth for conversion optimization
    let maxScroll = 0;
    let scrollTracked = false;

    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
        }

        // Track 75% scroll depth once
        if (scrollPercent >= 75 && !scrollTracked) {
            scrollTracked = true;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll_depth', {
                    'percent_scrolled': 75,
                    'page_title': document.title
                });
            }
        }
    });
});