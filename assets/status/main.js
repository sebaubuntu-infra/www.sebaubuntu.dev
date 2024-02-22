//
// SPDX-FileCopyrightText: 2024 Sebastiano Barezzi <seba@sebaubuntu.dev>
// SPDX-License-Identifier: MIT
//

import InfoTab from "./InfoTab.js";
import { humanFileSize } from "./utils.js";

const API_URL = "https://api.sebaubuntu.dev/system_info/v1";

let mainPageElement = document.getElementById("main-page");

async function getSystemInfos() {
	let response = await fetch(`${API_URL}/system`);
	if (!response.ok) {
		return null;
	}

	let systemInfo = await response.json();

	let systemInfoTab = new InfoTab(
		"System",
		new Map([
			["Manufacturer", systemInfo.system.manufacturer],
			["Model", systemInfo.system.model],
			["Version", systemInfo.system.version],
			["SKU", systemInfo.system.sku],
			["Virtual", systemInfo.system.virtual],
			["Virtual host", systemInfo.system.virtualHost],
		])
	);

	let biosInfoTab = new InfoTab(
		"BIOS",
		new Map([
			["Vendor", systemInfo.bios.vendor],
			["Version", systemInfo.bios.version],
			["Revision", systemInfo.bios.revision],
			["Language", systemInfo.bios.language],
			["Features", systemInfo.bios.features],
		])
	);

	let baseboardInfoTab = new InfoTab(
		"Baseboard",
		new Map([
			["Manufacturer", systemInfo.baseboard.manufacturer],
			["Model", systemInfo.baseboard.model],
			["Version", systemInfo.baseboard.version],
			["Max memory", systemInfo.baseboard.memMax],
			["Memory slots", systemInfo.baseboard.memSlots],
		])
	);

	let chassisInfoTab = new InfoTab(
		"Chassis",
		new Map([
			["Manufacturer", systemInfo.chassis.manufacturer],
			["Model", systemInfo.chassis.model],
			["Type", systemInfo.chassis.type],
			["Version", systemInfo.chassis.version],
			["SKU", systemInfo.chassis.sku],
		])
	);

	return [
		systemInfoTab,
		biosInfoTab,
		baseboardInfoTab,
		chassisInfoTab,
	];
}

async function getCpuInfos() {
	let response = await fetch(`${API_URL}/cpu`);
	if (!response.ok) {
		return null;
	}

	let cpuInfo = await response.json();

	let cpuInfoTab = new InfoTab(
		"CPU",
		new Map([
			["Manufacturer", cpuInfo.manufacturer],
			["Brand", cpuInfo.brand],
			["Vendor", cpuInfo.vendor],
			["Family", cpuInfo.family],
			["Model", cpuInfo.model],
			["Stepping", cpuInfo.stepping],
			["Revision", cpuInfo.revision],
			["Voltage", `${cpuInfo.voltage} V`],
			["Speed", `${cpuInfo.speed} GHz`],
			["Minimum speed", `${cpuInfo.speedMin} GHz`],
			["Maximum speed", `${cpuInfo.speedMax} GHz`],
			["Governor", cpuInfo.governor],
			["Cores", cpuInfo.cores],
			["Physical cores", cpuInfo.physicalCores],
			["Performance cores", cpuInfo.performanceCores],
			["Efficiency cores", cpuInfo.efficiencyCores],
			["Processors", cpuInfo.processors],
			["Socket", cpuInfo.socket],
			["Flags", cpuInfo.flags],
			["Virtualization", cpuInfo.virtualization],
		])
	);

	let cpuCacheInfoTab = new InfoTab(
		"CPU cache",
		new Map([
			["L1D cache", humanFileSize(cpuInfo.cache.l1d)],
			["L1I cache", humanFileSize(cpuInfo.cache.l1i)],
			["L2 cache", humanFileSize(cpuInfo.cache.l2)],
			["L3 cache", humanFileSize(cpuInfo.cache.l3)],
		])
	);

	let cpuCurrentSpeedInfoTab = new InfoTab(
		"CPU current speed",
		new Map([
			["Current minimum speed", `${cpuInfo.currentSpeed.min} GHz`],
			["Current maximum speed", `${cpuInfo.currentSpeed.max} GHz`],
			["Current average speed", `${cpuInfo.currentSpeed.avg} GHz`],
			["Currently enabled cores speed", cpuInfo.currentSpeed.cores.map(
				(core) => `${core} GHz`
			)],
		])
	);

	let cpuTemperaturesInfoTab = new InfoTab(
		"CPU temperatures",
		new Map([
			["Main temperature", `${cpuInfo.temperature.main}°C`],
			["Cores temperature", cpuInfo.temperature.cores.map((temp) => `${temp}°C`)],
			["Maximum temperature", `${cpuInfo.temperature.max}°C`],
			["Socket temperature", cpuInfo.temperature.socket.map((temp) => `${temp}°C`)],
			["Chipset temperature", `${cpuInfo.temperature.chipset}°C`],
		])
	);

	return [
		cpuInfoTab,
		cpuCacheInfoTab,
		cpuCurrentSpeedInfoTab,
		cpuTemperaturesInfoTab,
	];
}

async function getMemoryInfos() {
	let response = await fetch(`${API_URL}/memory`);
	if (!response.ok) {
		return null;
	}

	let memoryInfo = await response.json();

	let memoryInfoTab = new InfoTab(
		"Memory",
		new Map([
			["Total", humanFileSize(memoryInfo.total)],
			["Free", humanFileSize(memoryInfo.free)],
			["Used", humanFileSize(memoryInfo.used)],
			["Active", humanFileSize(memoryInfo.active)],
			["Buff/cache", humanFileSize(memoryInfo.buffcache)],
			["Buffers", humanFileSize(memoryInfo.buffers)],
			["Cached", humanFileSize(memoryInfo.cached)],
			["Slab", humanFileSize(memoryInfo.slab)],
			["Available", humanFileSize(memoryInfo.available)],
			["Swap total", humanFileSize(memoryInfo.swaptotal)],
			["Swap used", humanFileSize(memoryInfo.swapused)],
			["Swap free", humanFileSize(memoryInfo.swapfree)],
		])
	);

	let memoryLayoutInfoTabs = memoryInfo.memLayout.map((memoryLayout, index) => {
		return new InfoTab(
			`Memory layout #${index}`,
			new Map([
				["Size", humanFileSize(memoryLayout.size)],
				["Bank", humanFileSize(memoryLayout.bank)],
				["Type", memoryLayout.type],
				["ECC", memoryLayout.ecc],
				["Clock speed", `${memoryLayout.clockSpeed} MHz`],
				["Form factor", memoryLayout.formFactor],
				["Manufacturer", memoryLayout.manufacturer],
				["Part number", memoryLayout.partNum],
				[
					"Configured voltage",
					memoryLayout.voltageConfigured != null
							? `${memoryLayout.voltageConfigured} V`
							: null
				],
				[
					"Minimum voltage",
					memoryLayout.voltageMin != null ? `${memoryLayout.voltageMin} V` : null
				],
				[
					"Maximum voltage",
					memoryLayout.voltageMax != null ? `${memoryLayout.voltageMax} V` : null
				],
			])
		);
	});

	return [memoryInfoTab, ...memoryLayoutInfoTabs];
}

async function getBatteriesInfos() {
	let response = await fetch(`${API_URL}/batteries`);
	if (!response.ok) {
		return null;
	}

	let batteriesInfo = await response.json();

	let memoryInfoTab = new InfoTab(
		"Battery",
		new Map([
			["AC connected", batteriesInfo.acConnected],
		])
	);

	let batteryInfoTabs = batteriesInfo.batteries.map((battery, index) => {
		return new InfoTab(
			`Battery #${index}`,
			new Map([
				["Cycle count", battery.cycleCount],
				["Is charging", battery.isCharging],
				["Designed capacity", `${battery.designedCapacity} ${battery.capacityUnit}`],
				["Max capacity", `${battery.maxCapacity} ${battery.capacityUnit}`],
				["Current capacity", `${battery.currentCapacity} ${battery.capacityUnit}`],
				["Voltage", `${battery.voltage} V`],
				["Percent", `${battery.percent}%`],
				["Time remaining", battery.timeRemaining],
				["AC connected", battery.acConnected],
				["Type", battery.type],
				["Model", battery.model],
				["Manufacturer", battery.manufacturer],
			])
		);
	});

	return [memoryInfoTab, ...batteryInfoTabs];
}

async function getGpusInfos() {
	let response = await fetch(`${API_URL}/gpus`);
	if (!response.ok) {
		return null;
	}

	let gpusInfo = await response.json();

	let gpusInfoTabs = gpusInfo.map((gpu, index) => {
		return new InfoTab(
			`GPU #${index}`,
			new Map([
				["Vendor", gpu.vendor],
				["Model", gpu.model],
				["Bus", gpu.bus],
				["Bus address", gpu.busAddress],
				["VRAM", humanFileSize(gpu.vram)],
				["Dynamic VRAM", humanFileSize(gpu.vramDynamic)],
				["PCI ID", gpu.pciID],
				["Driver version", gpu.driverVersion],
				["Sub device ID", gpu.subDeviceId],
				["Name", gpu.name],
				["PCI bus", gpu.pciBus],
				["Fan speed", gpu.fanSpeed],
				["Memory total", humanFileSize(gpu.memoryTotal)],
				["Memory used", humanFileSize(gpu.memoryUsed)],
				["Memory free", humanFileSize(gpu.memoryFree)],
				["Utilization GPU", `${gpu.utilizationGpu}%`],
				["Utilization memory", `${gpu.utilizationMemory}%`],
				["Temperature GPU", `${gpu.temperatureGpu}°C`],
				["Power draw", `${gpu.powerDraw} W`],
				["Power limit", `${gpu.powerLimit} W`],
				["Clock core", `${gpu.clockCore} MHz`],
				["Clock memory", `${gpu.clockMemory} MHz`],
			])
		);
	});

	return gpusInfoTabs;
}

async function getOsInfos() {
	let response = await fetch(`${API_URL}/os`);
	if (!response.ok) {
		return null;
	}

	let osInfo = await response.json();

	let osInfoTab = new InfoTab(
		"OS",
		new Map([
			["Platform", osInfo.os.platform],
			["Distro", osInfo.os.distro],
			["Release", osInfo.os.release],
			["Codename", osInfo.os.codename],
			["Kernel", osInfo.os.kernel],
			["Arch", osInfo.os.arch],
			["Hostname", osInfo.os.hostname],
			["FQDN", osInfo.os.fqdn],
			["Codepage", osInfo.os.codepage],
			["Logofile", osInfo.os.logofile],
			["Build", osInfo.os.build],
			["Service pack", osInfo.os.servicepack],
			["UEFI", osInfo.os.uefi ? "Yes" : "No"],
			["Hypervizor", osInfo.os.hypervizor ? "Yes" : "No"],
			["Remote session", osInfo.os.remoteSession ? "Yes" : "No"],
			["Shell", osInfo.shell],
		])
	);

	let versionsInfoTab = new InfoTab(
		"OS versions",
		new Map([
			["Kernel version", osInfo.versions.kernel],
			["OpenSSL version", osInfo.versions.openssl],
			["System OpenSSL version", osInfo.versions.systemOpenssl],
			["System OpenSSL lib version", osInfo.versions.systemOpensslLib],
			["Node version", osInfo.versions.node],
			["V8 version", osInfo.versions.v8],
			["NPM version", osInfo.versions.npm],
			["Yarn version", osInfo.versions.yarn],
			["PM2 version", osInfo.versions.pm2],
			["Gulp version", osInfo.versions.gulp],
			["Grunt version", osInfo.versions.grunt],
			["Git version", osInfo.versions.git],
			["TSC version", osInfo.versions.tsc],
			["MySQL version", osInfo.versions.mysql],
			["Redis version", osInfo.versions.redis],
			["MongoDB version", osInfo.versions.mongodb],
			["Apache version", osInfo.versions.apache],
			["NGINX version", osInfo.versions.nginx],
			["PHP version", osInfo.versions.php],
			["Docker version", osInfo.versions.docker],
			["Postfix version", osInfo.versions.postfix],
			["PostgreSQL version", osInfo.versions.postgresql],
			["Perl version", osInfo.versions.perl],
			["Python version", osInfo.versions.python],
			["Python3 version", osInfo.versions.python3],
			["Java version", osInfo.versions.java],
			["GCC version", osInfo.versions.gcc],
			["VirtualBox version", osInfo.versions.virtualbox],
			["Bash version", osInfo.versions.bash],
			["ZSH version", osInfo.versions.zsh],
			["Fish version", osInfo.versions.fish],
			["PowerShell version", osInfo.versions.powershell],
			[".NET version", osInfo.versions.dotnet],
		])
	);

	return [osInfoTab, versionsInfoTab];
}

async function main() {
	let informationDashboardElement = document.createElement("div");
	informationDashboardElement.classList.add("information-dashboard");

	let systemInfos = await getSystemInfos();
	if (systemInfos) {
		systemInfos.forEach((info) => {
			informationDashboardElement.appendChild(info.toHtml());
		});
	}

	let cpuInfos = await getCpuInfos();
	if (cpuInfos) {
		cpuInfos.forEach((info) => {
			informationDashboardElement.appendChild(info.toHtml());
		});
	}

	let memoryInfos = await getMemoryInfos();
	if (memoryInfos) {
		memoryInfos.forEach((info) => {
			informationDashboardElement.appendChild(info.toHtml());
		});
	}

	let batteriesInfos = await getBatteriesInfos();
	if (batteriesInfos) {
		batteriesInfos.forEach((info) => {
			informationDashboardElement.appendChild(info.toHtml());
		});
	}

	let gpusInfos = await getGpusInfos();
	if (gpusInfos) {
		gpusInfos.forEach((info) => {
			informationDashboardElement.appendChild(info.toHtml());
		});
	}

	let osInfos = await getOsInfos();
	if (osInfos) {
		osInfos.forEach((info) => {
			informationDashboardElement.appendChild(info.toHtml());
		});
	}

	mainPageElement.innerHTML = `
		<h1>Server status</h1>
	`;
	mainPageElement.appendChild(informationDashboardElement);
}

main();
