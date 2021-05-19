from setuptools import setup

setup(name='da-marketplace-exberry-adapter',
      version='0.0.2',
      description='Daml Marketplace Exberry Adapter',
      author='Digital Asset',
      url='daml.com',
      license='Apache2',
      install_requires=['dazl>=7,<8', 'aiohttp'],
      packages=['bot'],
      include_package_data=True)
