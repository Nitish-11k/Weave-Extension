import os
from PIL import Image, ImageDraw

def create_circular_icon(size, path):
    # Create an image with transparent background
    image = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    
    # Draw a circle (accent color)
    draw.ellipse((0, 0, size, size), fill="#8B5CF6") # Purple accent
    
    # Draw an inner smaller circle or W (we'll just draw a smaller white circle for abstract 'weave' hub)
    inner_size = size * 0.4
    offset = (size - inner_size) / 2
    draw.ellipse((offset, offset, offset + inner_size, offset + inner_size), fill="#FFFFFF")
    
    os.makedirs(os.path.dirname(path), exist_ok=True)
    image.save(path, "PNG")

if __name__ == "__main__":
    create_circular_icon(16, "weave-extension/icons/icon16.png")
    create_circular_icon(48, "weave-extension/icons/icon48.png")
    create_circular_icon(128, "weave-extension/icons/icon128.png")
    print("Icons generated successfully!")
