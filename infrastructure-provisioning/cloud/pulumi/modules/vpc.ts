import * as aws from "@pulumi/aws";

// Keep types in a separate file to keep things clean in this main file
import { NameIdOutputs, keyPulumiValue } from "../types/types";

// Instantiating Constants
const pubSubnets: NameIdOutputs = {};
// const privSubnets: NameIdOutputs = {};
const routeTables: keyPulumiValue = {};
const routeTableRoutes: keyPulumiValue = {};

export function createVpc(config: any) {
    // Create the VPC
    const vpc = new aws.ec2.Vpc("primary", {
        cidrBlock: config.network.vpc.cidr_block,
        enableDnsHostnames: true,
        tags: Object.assign({}, config.tags, { Name: config.network.vpc.name }),
    });

    // // Private Hosted Zone - Disabled for now; only public nodes
    // const privateHostedZone = new aws.route53.Zone("primary", {
    //     name: config.general.domain,
    //     comment: config.general.domain_comment,
    //     vpcs: [{ vpcId: vpc.id, vpcRegion: config.cloud_auth.aws_region }],
    //     tags: Object.assign({}, config.tags, {
    //         Name: config.general.domain,
    //     }),
    // });

    // Create the DHCP Options
    const dhcpOpts = new aws.ec2.VpcDhcpOptions("cloud.danmanners.com", {
        domainName: config.general.domain,
        netbiosNodeType: "2",
        domainNameServers: ["169.254.169.253"],
        tags: Object.assign({}, config.tags, {
            Name: config.general.domain,
        }),
    });

    // Associate the DHCP Options to the VPC
    new aws.ec2.VpcDhcpOptionsAssociation("cloud.danmanners.com", {
        vpcId: vpc.id,
        dhcpOptionsId: dhcpOpts.id,
    });

    // Create the Public Subnets
    for (const subnet of config.network.subnets.public) {
        const s = new aws.ec2.Subnet(subnet.name, {
            vpcId: vpc.id,
            cidrBlock: subnet.cidr_block,
            availabilityZone: `${config.cloud_auth.aws_region}${subnet.az}`,
            mapPublicIpOnLaunch: true,
            tags: Object.assign({}, config.tags, {
                Name: subnet.name,
                "kubernetes.io/role/elb": "1",
                "kubernetes.io/cluster/homelab-cloud": "shared",
            }),
        });
        pubSubnets[subnet.name] = { id: s.id };
        Object.assign({}, (pubSubnets[subnet.name].id = s.id));
    }

    // // Create the Private Subnets - Disabled for now; only public nodes
    // for (const subnet of config.network.subnets.private) {
    //     const s = new aws.ec2.Subnet(subnet.name, {
    //         vpcId: vpc.id,
    //         cidrBlock: subnet.cidr_block,
    //         availabilityZone: `${config.cloud_auth.aws_region}${subnet.az}`,
    //         tags: Object.assign({}, config.tags, {
    //             Name: subnet.name,
    //             "kubernetes.io/role/internal-elb": "1",
    //             "kubernetes.io/cluster/homelab-cloud": "shared",
    //         }),
    //     });
    //     privSubnets[subnet.name] = { id: s.id };
    // }

    // Create the Internet Gateway
    const gw = new aws.ec2.InternetGateway("gw", {
        vpcId: vpc.id,
        tags: Object.assign({}, config.tags, {
            Name: `${config.network.vpc.name}-igw`,
        }),
    });

    // Create the Elastic IP for the NAT Gateway
    const natgw_eip = new aws.ec2.Eip("natgw", {
        vpc: true,
        tags: Object.assign({}, config.tags, {
            Name: `${config.network.vpc.name}-igw`,
        }),
    });

    // // Create the NAT Gateway - Disabled for now; only public nodes
    // const natgw = new aws.ec2.NatGateway("natgw", {
    //     allocationId: natgw_eip.id,
    //     subnetId: pubSubnets[config.network.subnets.public[0].name].id,
    //     privateIp: config.network.subnets.public[0].privateIP,
    //     // TODO: figure out how to make this less crap
    //     tags: Object.assign({}, config.tags, {
    //         Name: `${config.network.vpc.name}-ngw`,
    //     }),
    // });

    // Create the Public Subnet Route Tables
    for (const subnet of config.network.subnets.public) {
        const rt = new aws.ec2.RouteTable(
            `${config.network.vpc.name}-${subnet.name}`,
            {
                vpcId: vpc.id,
                tags: Object.assign({}, config.tags, { Name: subnet.name }),
            }
        );
        routeTables[`${subnet.name}`] = rt.id;
    }

    // // Create the Private Subnet Route Tables
    // // - Disabled for now; only public nodes
    // for (const subnet of config.network.subnets.private) {
    //     const rt = new aws.ec2.RouteTable(
    //         `${config.network.vpc.name}-${subnet.name}`,
    //         {
    //             vpcId: vpc.id,
    //             tags: Object.assign({}, config.tags, { Name: subnet.name }),
    //         }
    //     );
    //     routeTables[`${subnet.name}`] = rt.id;
    // }

    // Create the Public Subnet Routes on the previously created Route Tables
    for (const [key, value] of Object.entries(pubSubnets)) {
        const route = new aws.ec2.Route(`${key}-ro`, {
            routeTableId: routeTables[key],
            destinationCidrBlock: "0.0.0.0/0",
            gatewayId: gw.id,
        });
        routeTableRoutes[`${key}-route`] = route.id;
    }

    // // Create the Private Subnet Routes on the previously created Route Tables
    // // - Disabled for now; only public nodes
    // for (const [key, value] of Object.entries(privSubnets)) {
    //     const route = new aws.ec2.Route(`${key}-ro`, {
    //         routeTableId: routeTables[key],
    //         destinationCidrBlock: "0.0.0.0/0",
    //         natGatewayId: natgw.id,
    //     });
    //     routeTableRoutes[`${key}-route`] = route.id;
    // }

    // Public Subnet Route Table Associations
    for (const [key, value] of Object.entries(pubSubnets)) {
        new aws.ec2.RouteTableAssociation(`${key}-rta`, {
            subnetId: value.id,
            routeTableId: routeTables[key],
        });
    }

    // // Private Subnet Route Table Associations
    // // - Disabled for now; only public nodes
    // for (const [key, value] of Object.entries(privSubnets)) {
    //     new aws.ec2.RouteTableAssociation(`${key}-rta`, {
    //         subnetId: value.id,
    //         routeTableId: routeTables[key],
    //     });
    // }

    return {
        id: vpc.id,                             // VPC ID
        pubSubnets: pubSubnets,                 // Public Subnets Map
        // privSubnets: privSubnets,               // Private Subnets Map
        // privateHostedZone: privateHostedZone,   // ARN of the Route53 PrivateHostedZone
    };
}