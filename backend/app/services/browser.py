from playwright.async_api import async_playwright, Page
import asyncio
import random
from typing import List, Dict, Optional

class BrowserService:
    def __init__(self):
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
        ]

    async def _launch_browser(self, p):
        return await p.chromium.launch(
            headless=True, # Set to False for debugging visibility
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-infobars",
                "--window-size=1920,1080"
            ]
        )

    async def _create_context(self, browser):
        return await browser.new_context(
            user_agent=random.choice(self.user_agents),
            viewport={"width": 1920, "height": 1080},
            locale="en-US",
            timezone_id="America/New_York",
            permissions=["geolocation"]
        )

    async def extract_job_text(self, url: str) -> str:
        """Navigates to a URL and extracts the main text content."""
        async with async_playwright() as p:
            browser = await self._launch_browser(p)
            context = await self._create_context(browser)
            page = await context.new_page()
            
            try:
                await page.goto(url, timeout=30000, wait_until="domcontentloaded")
                await self._stealth_delay(page) # Random delay
                
                # Cleanup common overlays (modals, cookie banners) - Primitive approach
                try:
                    await page.evaluate("() => { const overlays = document.querySelectorAll('.modal, .cookie-banner, [id*=\"cookie\"]'); overlays.forEach(el => el.remove()); }")
                except: pass

                content = await page.inner_text("body")
                return content[:10000] # Increased limit for enhanced parsing
            except Exception as e:
                print(f"Scraping failed: {e}")
                return ""
            finally:
                await browser.close()

    async def extract_form_structure(self, url: str) -> List[Dict]:
        """
        Analyzes the page for input forms and returns a structured list of fields.
        Useful for the AI to decide what to fill.
        """
        async with async_playwright() as p:
            browser = await self._launch_browser(p)
            context = await self._create_context(browser)
            page = await context.new_page()
            
            try:
                await page.goto(url, timeout=30000, wait_until="networkidle")
                await self._stealth_delay(page)
                
                # Execute JS to find all inputs and relevant metadata
                inputs = await page.evaluate("""() => {
                    const fields = [];
                    const inputs = document.querySelectorAll('input, textarea, select');
                    
                    inputs.forEach((el, index) => {
                        if (el.type === 'hidden' || el.style.display === 'none') return;
                        
                        // Try to find label
                        let label = "";
                        if (el.id) {
                            const labelEl = document.querySelector(`label[for="${el.id}"]`);
                            if (labelEl) label = labelEl.innerText;
                        }
                        if (!label && el.placeholder) label = el.placeholder;
                        if (!label) label = el.getAttribute('aria-label') || "";
                        if (!label) {
                             // Heuristic: check previous sibling or parent text
                             label = el.parentElement?.innerText?.substring(0, 50) || "";
                        }

                        fields.push({
                            index: index,
                            tag: el.tagName.toLowerCase(),
                            type: el.type || 'text',
                            id: el.id || '',
                            name: el.name || '',
                            label: label.trim().replace(/\\n/g, ' '),
                            selector: el.id ? `#${el.id}` : (el.name ? `[name="${el.name}"]` : '') 
                        });
                    });
                    return fields;
                }""")
                
                # Post-process: If no generic selector found, we might need a stronger path strategy
                # For now, we rely on the ID/Name which is common in forms.
                return inputs

            except Exception as e:
                print(f"Form extraction failed: {e}")
                return []
            finally:
                await browser.close()

    async def fill_form(self, url: str, field_map: Dict[str, str]) -> Dict:
        """
        Navigates to URL and fills fields based on a selector->value map.
        field_map example: {"#first_name": "John", "[name='email']": "john@doe.com"}
        """
        async with async_playwright() as p:
            browser = await self._launch_browser(p)
            context = await self._create_context(browser)
            page = await context.new_page()
            
            result = {"status": "success", "filled": [], "failed": []}
            
            try:
                await page.goto(url, timeout=30000, wait_until="networkidle")
                await self._stealth_delay(page)
                
                for selector, value in field_map.items():
                    try:
                        if not selector: continue
                        
                        # Wait for element
                        element = page.locator(selector).first
                        if await element.is_visible():
                            # Clear and type with delay
                            await element.click()
                            await element.fill(value) 
                            # Simulating human typing speed is implicit in Playwright but we can delay
                            # await page.keyboard.type(value, delay=random.randint(50, 150)) # More human
                            
                            result["filled"].append(selector)
                        else:
                            result["failed"].append(f"{selector} (not visible)")
                            
                    except Exception as e:
                        result["failed"].append(f"{selector} ({str(e)})")
                
                # Optional: specific submit logic would go here
                
                return result

            except Exception as e:
                return {"status": "error", "message": str(e)}
            finally:
                await browser.close()

    async def _stealth_delay(self, page: Page):
        """Random delay and mouse movement to mimic human behavior."""
        ms = random.randint(1000, 3000)
        await page.wait_for_timeout(ms)
        # TODO: Add mouse curve movements for better stealth

browser_service = BrowserService()
