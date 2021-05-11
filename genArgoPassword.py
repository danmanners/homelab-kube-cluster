import argparse
import bcrypt

parser = argparse.ArgumentParser(
    description="Convert Strings to a bcrypt password format."
)
parser.add_argument("password", type=str, help="Password you wish to encrypt.")
args = parser.parse_args()

print(
    bcrypt.hashpw(str.encode(args.password), bcrypt.gensalt(rounds=15)).decode("ascii")
)
