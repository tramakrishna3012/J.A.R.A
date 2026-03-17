import asyncio
import os
from app.services.browser import browser_service

async def main():
    # Use absolute path for file:// protocol
    file_path = os.path.abspath("test_form.html")
    url = f"file:///{file_path}"
    
    print(f"Testing URL: {url}")
    
    print("\n--- Testing Form Extraction ---")
    structure = await browser_service.extract_form_structure(url)
    for field in structure:
        print(f"Found Field: {field['label']} -> {field['selector']} ({field['tag']})")
    
    if not structure:
        print("FAILED: No fields found.")
        return

    print("\n--- Testing Form Filling ---")
    # specific map based on our dummy html
    fill_map = {
        "#full_name": "Tony Stark",
        "#email": "tony@stark.com",
        "#phone": "1234567890",
        "#linkedin": "linkedin.com/in/ironman",
        "[name=\"cover_letter\"]": "I am Iron Man."
    }
    
    result = await browser_service.fill_form(url, fill_map)
    print("Fill Result:", result)

if __name__ == "__main__":
    asyncio.run(main())
