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
    yq   = pkgs.yq-go;
    
    # Web Development
    node        = pkgs.nodejs;
    npm         = pkgs.nodejs;
      # version = "16.13.2";
    yarn        = pkgs.yarn;
  });

}
