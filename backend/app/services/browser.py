import asyncio
from playwright.async_api import async_playwright
import random

class ActionEngine:
    def __init__(self):
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"

    async def navigate_and_extract(self, url: str) -> dict:
        """
        Navigates to a job URL and extracts details using Playwright.
        """
        data = {"url": url, "title": "", "company": "", "description": "", "status": "failed"}
        
        try:
            async with async_playwright() as p:
                # Launch browser (headless=True for server, False for debug)
                browser = await p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-setuid-sandbox"])
                
                context = await browser.new_context(
                    user_agent=self.user_agent,
                    viewport={"width": 1280, "height": 720}
                )
                
                page = await context.new_page()
                
                # Navigate with timeout
                print(f"Navigating to {url}...")
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                
                # Random wait to mimic human behavior
                await asyncio.sleep(random.uniform(1, 3))
                
                # Generic extraction (heuristics)
                # In a real app, we'd have site-specific selectors (LinkedIn, Indeed, etc.)
                data["title"] = await page.title()
                
                # Attempt to find common job elements
                # Common H1s for job titles
                h1_text = await page.evaluate("() => document.querySelector('h1')?.innerText")
                if h1_text:
                    data["title"] = h1_text
                    
                # Extract meta description as fallback for description
                meta_desc = await page.evaluate("() => document.querySelector('meta[name=\"description\"]')?.content")
                data["description"] = meta_desc or "No description found."
                
                data["status"] = "success"
                
                await browser.close()
                
        except Exception as e:
            print(f"Simple Browser Error: {e}")
            data["error"] = str(e)
            
        return data

    async def auto_fill(self, form_data: dict, url: str):
        """
        Stub for complex form filling - would require selector mapping.
        """
        print(f"Auto-filling form at {url} with data: {form_data.keys()}")
        return True

browser_engine = ActionEngine()
