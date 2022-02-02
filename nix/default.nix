{ system ? builtins.currentSystem }:

let
  pkgs = import ./nixpkgs.nix { inherit system; };

  # Selects "bin" output from multi-output derivations which are has it. For
  # other multi-output derivations, select only the first output. For
  # single-output generation, do nothing.
  #
  # This ensures that as few output as possible of the tools we use below are
  # realized by Nix.
  selectBin = pkg:
    if pkg == null then
      null
    else if builtins.hasAttr "bin" pkg then
      pkg.bin
    else if builtins.hasAttr "outputs" pkg then
      builtins.getAttr (builtins.elemAt pkg.outputs 0) pkg
    else
      pkg;

in rec {
  inherit pkgs;
  tools = pkgs.lib.mapAttrs (_: pkg: selectBin pkg) (rec {


    # to find the particular shas for specific versions of libraries, this looks to be a reasonably useful search tool
    # https://lazamar.co.uk/nix-versions/?channel=nixpkgs-unstable&package=<package-name>
    # example : https://lazamar.co.uk/nix-versions/?channel=nixpkgs-unstable&package=yq-go

    # tools
    make            = pkgs.gnumake;

    # Python development
    pip3        = pkgs.python37Packages.pip;
    python      = python37;
    python3     = python37;
    python37    = pkgs.python37Packages.python;

    yapf = pkgs.python37Packages.yapf;

    pex = pkgs.python37Packages.pex;
    pipenv = import ./tools/pipenv {
      lib = pkgs.lib;
      python3 = python3;
    };
        
    # String mangling tooling.
    jq   = pkgs.jq;

    # version: 3.4.1
    yq3pkgs = import (builtins.fetchTarball {
        url = "https://github.com/NixOS/nixpkgs/archive/559cf76fa3642106d9f23c9e845baf4d354be682.tar.gz";
    }) {};
    yq = yq3pkgs.yq-go;

    # version = "16.13.1";
    nodePkgs16 = import (builtins.fetchTarball {
        url = "https://github.com/NixOS/nixpkgs/archive/c82b46413401efa740a0b994f52e9903a4f6dcd5.tar.gz";
    }) {};

    node        = nodePkgs16.nodejs;
    npm         = nodePkgs16.nodejs;
    yarn        = nodePkgs16.yarn;
  });

}
