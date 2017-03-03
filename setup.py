#!/usr/bin/env python
# :coding: utf-8

import setuptools

setuptools.setup(
    name="idaho-journal",
    author="Christoph Buelter",
    author_email="info@cbuelter.de",
    packages=setuptools.find_packages(),
    install_requires=open("requirements.txt").readlines(),
)
