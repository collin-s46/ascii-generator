from PIL import Image
import requests
from io import BytesIO
import base64

# Characters used for ASCII art, ordered by brightness
ASCII_CHARS = "@%#*+=-:. <>/|[]!"

def resize_image(image, new_width=500):
    """Resize the image while maintaining aspect ratio."""
    width, height = image.size
    aspect_ratio = height / width
    new_height = int(aspect_ratio * new_width * 0.55)  # 0.55 accounts for aspect ratio distortion
    return image.resize((new_width, new_height))

def grayscale_image(image):
    """Convert image to grayscale."""
    return image.convert("L")

def image_to_ascii(image):
    """Convert image to ASCII characters."""
    pixels = image.getdata()
    ascii_str = "".join(ASCII_CHARS[pixel // 25] for pixel in pixels)
    return ascii_str

def format_ascii(ascii_str, width):
    """Format ASCII string into lines."""
    return "\n".join(ascii_str[i:i + width] for i in range(0, len(ascii_str), width))

def fetch_image_from_url(url):
    """Fetch an image from a standard HTTP/HTTPS URL."""
    response = requests.get(url)
    response.raise_for_status()  # Raise an error for bad status codes
    return Image.open(BytesIO(response.content))

def fetch_image_from_base64(data_uri):
    """Decode a Base64 data URI into an image."""
    # Extract the Base64 string
    header, encoded = data_uri.split(",", 1)
    if "base64" not in header:
        raise ValueError("Invalid data URI format")
    image_data = base64.b64decode(encoded)
    return Image.open(BytesIO(image_data))

def image_url_to_ascii(source, new_width=500):
    """Convert an image from a URL or Base64 data URI to ASCII art."""
    if source.startswith("data:image"):
        image = fetch_image_from_base64(source)
    else:
        image = fetch_image_from_url(source)

    image = resize_image(image, new_width)
    image = grayscale_image(image)
    ascii_str = image_to_ascii(image)
    ascii_art = format_ascii(ascii_str, new_width)
    return ascii_art

# Example usage
if __name__ == "__main__":
    image_source = input("Enter the image URL or Base64 data URI: ")
    try:
        ascii_art = image_url_to_ascii(image_source, new_width=100)
        print(ascii_art)
    except Exception as e:
        print(f"Error: {e}")
