from setuptools import setup

setup(name='marketplace-exchange-adapter',
      version='0.1.17',
      description='Daml Marketplace Exchange Adapter',
      author='Digital Asset',
      url='daml.com',
      license='Apache2',
      install_requires=['dazl>=7,<8', 'aiohttp'],
      packages=['bot'],
      include_package_data=True)
