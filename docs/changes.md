                                                                                
  ---                                                                                                    
  GTM Setup Service — Website Change History
                                                                                                              
  Tracking & Analytics                                      
                                                                                                              
  - GTM integration — Added GTM container ID to _config.yml; GTM snippet added to all pages via default layout
  - GA4 measurement ID — Corrected twice (typo $37→$397 price, wrong ID), now set to G-EL900BEWMS             
  - Scroll depth tracking — Replaced direct gtag() scroll calls with dataLayer.push; added all four milestones
   (25%, 50%, 75%, 100%); added post_read_complete event at 100%                                              
  - CTA click tracking — Added cta-link class to all CTA buttons across the site for GTM click trigger        
  - Form submission tracking — Moved from direct gtag() to dataLayer.push for form_submission event; added UTM
   params (utm_source, utm_medium, utm_campaign) and page_referrer to the push                                
  - Form error tracking — Replaced gtag() error call with dataLayer.push; discriminates server_error vs       
  network_error                                                                                               
  - Attribution — UTM parameters captured from URL into hidden form fields and pushed to dataLayer on
  submission                                                                                                  
  - Removed duplicate — Eliminated redundant direct gtag('event', 'generate_lead') call; GTM tag handles it
                                                                                                              
  ---                                                       
  SEO & Structured Data                                                                                       
                                                            
  - Schema markup — Added Organization, Service, and BreadcrumbList JSON-LD schemas; added logo and favicon
  - Service schema — Added dedicated Service JSON-LD to homepage for emergency recovery offering              
  - Case studies — Added case studies section with ItemList schema to homepage                                
  - FAQ schema — Added FAQ structured data to all blog posts                                                  
  - Sitemap & llm.txt — Added sitemap.xml and llm.txt for SEO and AI crawlers                                 
  - Featured snippets — Added direct answer paragraphs to all blog posts targeting featured snippet positions 
  - Blog posts — Restructured all posts with new TOCs; added 4 GTM diagnostic posts covering the 4-layer      
  framework; added GA4 404 tracking failure post; improved CTR metadata                                       
                                                                                                              
  ---                                                                                                         
  Performance                                               
             
  - Tailwind build — Replaced Tailwind CDN with local build step; CSS minified via npm run build:css
  - Script deferral — form-handler.js deferred to avoid render blocking                                       
  - CSS preload — Added preload hint for stylesheet                                                           
  - CI fix — Removed npm cache requirement; updated to Node 24                                                
                                                                                                              
  ---                                                                                                         
  Accessibility (WCAG AA)                                                                                     
                                                            
  - Contrast fixes — Four separate passes fixing color contrast failures: hero button, case study dates, green
   buttons, small text elements, and borderline green-100/green-600 combinations                              
   
  ---                                                                                                         
  Content & UI                                              
              
  - Pricing — Corrected emergency price typo ($37 → $397); updated CTA buttons to reflect pricing; removed
  money-back guarantee claims                                                                                 
  - Site identity — Corrected title and author name to "GTM Setup Service"; fixed service_type typo
  - Trust indicators — Added trust indicators to blog index and post layout                                   
  - Hero section — Multiple design iterations; bubble animations, wave transitions, improved spacing
  - About page — Improved layout with container; added navigation                                             
  - Contact form — Added required phone field; form submits to Pipedream webhook                              
                                                                                                              
  ---

  Rich Results & E-E-A-T

  - Person schema — Added Bradley Hamilton as named practitioner with jobTitle, knowsAbout (8 GTM/GA4 topics),
  linked to Organization via @id for E-E-A-T signals
  - Organization schema — Added @id, employee reference to Person, moved pricing onto Offer directly with
  availability: InStock and priceValidUntil on all three services ($397, $797, $197)
  - TechArticle schema — Added to every blog post with headline, image, author @id, publisher @id,
  datePublished, dateModified; author resolves to Person schema sitewide
  - ItemList schema — Fixed homepage case studies carousel: added @id, wrapped ListItems in item property with
  Article type, added headline/image/author to each entry; resolved "Unnamed item" warnings
  - Service schema — Fixed homepage Service Offer: added availability, priceValidUntil, url; removed redundant
  nested OfferCatalog
  - Validated in Google Rich Results Test: 7 valid carousel items detected, all named, all with author and image
  - GA4 custom dimensions — Registered: service_type, problem_type, cta_text, percent_scrolled, traffic_source,
  page_referrer; corrected parameter name mismatches (source→traffic_source, page_referrer→referring_page)

  ---

  404 & Indexation

  - 404 page — Created 404.html with service links and proper GitHub Pages 404 handling; surfaces GTM Recovery,
  Contact, and Blog as recovery paths
  - GTM tag — page_not_found GA4 event wired to fire on 404 page via Page View trigger with Page Title contains
  "404" condition; page_path parameter captures the broken URL
  - Dead URL cleanup — Identified 6 legacy 404 URLs in Search Console (hello-world, funnel-one, basic, author/pedro,
  privacy/about, privacy/privacy); confirmed none referenced in sitemap; validated fix in Search Console →
  Indexing → Pages; URL Removal requests submitted for immediate deindexing
  - Sitemap verified — _site/ is gitignored; live sitemap generated by GitHub Pages from _config.yml using
  correct https://gtmsetupservice.com base URL

  ---

  Search Console Analysis (April 2026)

  - Full assessment of Jan 15 – Apr 22, 2026 performance data
  - 2,389 total impressions, 0 clicks across entire period; top 3 posts ranking positions 6–7 but getting no
  clicks — attributed to SERP feature competition (featured snippets, PAA) absorbing intent
  - Impression collapse identified: 181/day in early Feb → 11/day by April; likely caused by 9 pages returning
  404 signaling site instability to Google
  - Indexation gap: only 6 of 37 pages indexed as of April 17; 25 not indexed, 9 returning 404, 7 with
  redirects, 7 crawled but not indexed
  - Commercial keywords (gtm installation services pos. 35, gtm configuration service pos. 60) confirmed as gap
  vs. diagnostic content (pos. 6–7); content strategy targets researchers not yet buyers

  ---

  Infrastructure

  - Custom domain — CNAME configured for gtmsetupservice.com
  - GitHub Pages — Deployment workflow added; domain corrected from gtmsetupservices.com → gtmsetupservice.com
  - Blog system — Full Jekyll blog with SEO optimization, featured images, clickable cards                    
                                                                                                 