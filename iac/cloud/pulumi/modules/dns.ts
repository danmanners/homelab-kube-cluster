import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export function r53record(
  zoneId: pulumi.Output<string>,
  name: string,
  ttl: number,
  type: string,
  records: string[] | pulumi.Output<string>[]
) {
  const record = new aws.route53.Record(name, {
    zoneId: zoneId,
    name: name,
    ttl: ttl,
    type: type,
    records: records,
  });
  return record;
}
