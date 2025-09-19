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

            // Prepare payload for FluentCRM
            const payload = {
                email: data.email,
                first_name: data.name.split(' ')[0],
                last_name: data.name.split(' ').slice(1).join(' '),
                tags: ['gtm-lead', 'website-contact'],
                custom_fields: {
                    website: data.website,
                    problem_type: data.problem,
                    problem_details: data.details,
                    service_type: data.service_type,
                    source_domain: data.source_domain,
                    utm_source: data.utm_source,
                    utm_medium: data.utm_medium,
                    utm_campaign: data.utm_campaign,
                    form_submitted: new Date().toISOString()
                },
                lists: [1] // Add to main list (ID to be configured)
            };

            try {
                // Send to FluentCRM API at getlocallyknown.com
                const response = await fetch('https://getlocallyknown.com/wp-json/fluent-crm/v2/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer YOUR_API_KEY_HERE' // TODO: Replace with actual API key
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    // Track successful form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'generate_lead', {
                            'currency': 'USD',
                            'value': 397,
                            'service_type': 'gtm',
                            'problem_type': data.problem
                        });
                    }

                    // Track in GTM dataLayer
                    if (typeof dataLayer !== 'undefined') {
                        dataLayer.push({
                            'event': 'form_submission',
                            'form_name': 'gtm_contact_form',
                            'service_type': 'gtm',
                            'problem_type': data.problem,
                            'conversion_value': 397
                        });
                    }

                    // Show success message
                    successMsg.classList.remove('hidden');
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                errorMsg.classList.remove('hidden');

                // Track form error
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_error', {
                        'service_type': 'gtm',
                        'error_type': 'submission_failed'
                    });
                }
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Get Your GTM Fixed Now - Starting at $397';
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