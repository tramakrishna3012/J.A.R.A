from playwright.async_api import async_playwright
import asyncio

class BrowserService:
    async def extract_job_text(self, url: str) -> str:
        """
        Navigates to a URL and extracts the main text content.
        Includes anti-bot measures (user-agent, stealth args).
        """
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-setuid-sandbox"
                ]
            )
            # Create context with realistic user agent
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            
            page = await context.new_page()
            
            try:
                # Go to URL with timeout
                await page.goto(url, timeout=30000, wait_until="domcontentloaded")
                
                # Simple extraction: Get all body text
                # In a real app, you'd target specific selectors like 'main', 'article', or '.job-description'
                content = await page.inner_text("body")
                
                return content[:5000] # Return first 5000 chars to avoid token limits
            
            except Exception as e:
                print(f"Scraping failed: {e}")
                return ""
            finally:
                await browser.close()

browser_service = BrowserService()
