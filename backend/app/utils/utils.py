import os

def load_txt_file(file_name: str) -> str:
    """
    Load the contents of a text file from the prompts directory.
    
    Args:
        file_name (str): Name of the text file to load
        
    Returns:
        str: Contents of the text file
        
    Raises:
        FileNotFoundError: If the file doesn't exist
    """
    # Get the directory where this file is located
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up one level to the app directory
    app_dir = os.path.dirname(current_dir)
    # Construct path to prompts directory
    prompts_dir = os.path.join(app_dir, "prompts")
    # Full path to the requested file
    file_path = os.path.join(prompts_dir, file_name)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"Prompt file not found: {file_name}") 