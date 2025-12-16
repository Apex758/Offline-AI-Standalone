import os
import atexit
from concurrent.futures import ProcessPoolExecutor, Future
from typing import Any, Callable, Optional
 
# Default number of workers: configurable via environment variable, else 2
DEFAULT_WORKERS = int(os.environ.get("PROCESS_POOL_WORKERS", 2))
 
# Singleton process pool executor
_executor: Optional[ProcessPoolExecutor] = ProcessPoolExecutor(max_workers=DEFAULT_WORKERS)
 
def get_executor() -> ProcessPoolExecutor:
    """
    Get the singleton process pool executor.
    Returns:
        ProcessPoolExecutor: The singleton executor instance.
    """
    global _executor
    if _executor is None:
        _executor = ProcessPoolExecutor(max_workers=DEFAULT_WORKERS)
    return _executor

def submit_task(fn: Callable[..., Any], *args, **kwargs) -> Future:
    """
    Submit a function to the process pool.
 
    Args:
        fn: The callable to execute.
        *args: Positional arguments for the callable.
        **kwargs: Keyword arguments for the callable.
 
    Returns:
        concurrent.futures.Future: Future representing the execution.
    """
    return get_executor().submit(fn, *args, **kwargs)

def shutdown_executor():
    """
    Shutdown the global process pool executor if it exists.
    Uses wait=False, cancel_futures=True if available (Python 3.9+), else falls back.
    """
    global _executor
    if _executor is not None:
        try:
            _executor.shutdown(wait=False, cancel_futures=True)
        except TypeError:
            # For Python < 3.9, cancel_futures is not available
            _executor.shutdown(wait=False)
        _executor = None

atexit.register(shutdown_executor)