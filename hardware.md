## 🔧 Hardware

Below is a list of the hardware (both physical and virtual) in use on this project

### 🖥 On-Prem Systems

-----

#### Baremetal Talos Hosts

| Count | System Type | CPU Type            | CPU Cores | Memory |
| ----- | ----------- | ------------------- | --------- | ------ |
| 1     | Desktop     | Intel Core i7-7700  | 4c8t      | 64GiB  |
| 1     | Desktop     | AMD Ryzen 7 5800X   | 8c16t     | 64GiB  |
| 1     | Desktop     | Intel Celeron J4105 | 4c4t      | 16GiB  |
| 1     | Desktop     | AMD Ryzen 5 3400G   | 4c8t      | 32GiB  |

#### Cluster Boards

| Count | System Type                                                                                                                                         | CPU Type                 | CPU Cores | Memory      |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------- | ----------- |
| 1     | [DeskPi Super6C](https://deskpi.com/collections/deskpi-super6c/products/deskpi-super6c-raspberry-pi-cm4-cluster-mini-itx-board-6-rpi-cm4-supported) | 4x Raspberry Pi CM4      | 4c4t      | 4x 8GiB     |
| ~~1~~ | [~~Turing Pi 2~~](https://www.kickstarter.com/projects/turingpi/turing-pi-cluster-board)                                                            | ~~4x Raspberry Pi CM4~~  | ~~4c4t~~  | ~~4x 8GiB~~ |
| ~~1~~ | [~~Turing Pi 1~~](https://turingpi.com/v1/)                                                                                                         | ~~7x Raspberry Pi CM3+~~ | ~~4c4t~~  | ~~7x 1GiB~~ |
| ~~1~~ | [~~Turing Pi 1~~](https://turingpi.com/v1/)                                                                                                         | ~~3x Raspberry Pi CM3+~~ | ~~4c4t~~  | ~~3x 1GiB~~ |

#### Additional Compute

| Count | System Type    | CPU Type         | CPU Cores | Memory |
| ----- | -------------- | ---------------- | --------- | ------ |
| 1     | Raspberry Pi 4 | Raspberry Pi CM4 | 4c4t      | 4GiB   |

#### Storage

| Hardware         | Drive Count                                                               | Memory    | CPU                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Custom Build     | 3x 2.7TiB 7200RPM<br>3x 3.6TiB 7200RPM<br>2x 512GiB SSD<br>2x 512GiB NVMe | 32GiB     | [Intel 12th-Gen 12600](https://ark.intel.com/content/www/us/en/ark/products/96149/intel-core-i512600-processor-18m-cache-up-to-4-80-ghz.html) |
| ~~QNAP TS-332X~~ | ~~3x M.2, 3x 3.5" 7200RPM~~                                               | ~~16GiB~~ | [Alpine AL-324](https://en.wikipedia.org/wiki/Annapurna_Labs#AL324)                                                                           |

#### Networking

| Hardware                    | SFP+ Ports | SFP Ports | 1Gb Eth Ports |
| --------------------------- | ---------- | --------- | ------------- |
| Ubiquiti EdgeSwitch 24 Lite | 0          | 2         | 24            |
| Ubiquiti EdgeSwitch 8 150W  | 0          | 2         | 8             |
| Mikrotik CRS305-1G-4S+      | 4          | 0         | 1 (PoE In)    |

### Cloud Hosted Resources

| Name                   | Provider  | Arch      | Instance Size | CPU       | Memory   |
| ---------------------- | --------- | --------- | ------------- | --------- | -------- |
| talos-azure-vm01       | Azure     | amd64     | Standard B2s  | 2vCPU     | 4GiB     |
| talos-aws-grav01       | AWS       | amd64     | t4g.small     | 2vCPU     | 2GiB     |
| ~~tpi-k3s-aws-edge~~   | ~~AWS~~   | ~~arm64~~ | ~~t4g.small~~ | ~~2vCPU~~ | ~~2GiB~~ |
| ~~tpi-k3s-aws-edge~~   | ~~AWS~~   | ~~amd64~~ | ~~t3.medium~~ | ~~2vCPU~~ | ~~4GiB~~ |
| ~~tpi-k3s-azure-edge~~ | ~~Azure~~ | ~~amd64~~ | Standard B2s  | ~~2vCPU~~ | ~~4GiB~~ |
