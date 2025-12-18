from jina import Flow

if __name__ == '__main__':
    # Create the flow in Python
    flow = Flow().add(uses='blip_executor.py', name='blip') \
                 .add(uses='llama_executor.py', name='llama')

    # Start the server
    with flow:
        flow.block()  # Keeps server running