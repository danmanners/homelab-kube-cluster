provider "digitalocean" {
  // Put your Digital Ocean API Token in a file at this location.
  // The 'chomp' function will remove any newlines in the file.
  token = chomp(file("~/.digitalocean/token"))
}
