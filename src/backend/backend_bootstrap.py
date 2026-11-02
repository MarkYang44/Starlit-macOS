"""Entry point used when assembling the native backend with the RC10 payload."""
from mac_compat import apply_compatibility_fixes

apply_compatibility_fixes()

from backend_entry import main

if __name__ == '__main__':
    main()
