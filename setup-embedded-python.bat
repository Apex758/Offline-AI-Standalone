@echo off
echo Setting up embedded Python distribution...

cd python-embed

echo Installing pip...
curl -o get-pip.py https://bootstrap.pypa.io/get-pip.py
python.exe get-pip.py --no-warn-script-location
del get-pip.py

echo Embedded Python setup complete!
pause

