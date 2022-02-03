# Update nixpkgs with:
# nix-shell -p niv --run "niv update"

let
  sources = import ./nix/sources.nix;
  pkgs = import sources.nixpkgs {};
in
pkgs.mkShell {
  buildInputs = [
    pkgs.bash
    pkgs.gnumake
    pkgs.jq
    pkgs.python37
    pkgs.yapf
    pkgs.pipenv
    pkgs.yq-go
    pkgs.nodejs
    pkgs.yarn
  ];
}
