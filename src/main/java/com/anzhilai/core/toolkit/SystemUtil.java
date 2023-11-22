package com.anzhilai.core.toolkit;

import oshi.SystemInfo;
import oshi.hardware.*;
import oshi.hardware.CentralProcessor.TickType;
import oshi.software.os.*;
import oshi.util.FormatUtil;
import oshi.util.Util;

import java.text.DecimalFormat;
import java.util.*;

/**
 * 获取操作系统信息.
 */
public class SystemUtil {

    public static void main(String[] args) {
        // Options: ERROR > WARN > INFO > DEBUG > TRACE
//        Logger LOG = LoggerFactory.getLogger(SystemInfoTest.class);
//        LOG.info("Initializing System...");
        SystemInfo si = new SystemInfo();

        HardwareAbstractionLayer hal = si.getHardware();
        OperatingSystem os = si.getOperatingSystem();

        System.out.println(os);

        System.out.println("=================Checking computer system...");
        printComputerSystem(hal.getComputerSystem());

        System.out.println("=================Checking Processor...");
        printProcessor(hal.getProcessor());

        System.out.println("=================Checking 内存...");
        printMemory(hal.getMemory());

        System.out.println("=================Checking CPU...");
        printCpu(os, hal.getProcessor());

        System.out.println("=================Checking 进程...");
        printProcesses(os, hal.getMemory());

        System.out.println("=================Checking 传感器...");
        printSensors(hal.getSensors());

        System.out.println("=================Checking 电源...");
        printPowerSources(hal.getPowerSources());

        System.out.println("=================Checking 硬盘...");
        printDisks(hal.getDiskStores());

        System.out.println("=================Checking 文件系统...");
        printFileSystem(os.getFileSystem());

        System.out.println("=================Checking 网络信息...");
        printNetworkInterfaces(hal.getNetworkIFs());

        System.out.println("=================Checking 网络参数...");
        printNetworkParameters(os.getNetworkParams());

        // hardware: displays
        System.out.println("=================Checking Displays...");
        printDisplays(hal.getDisplays());

        // hardware: USB devices
        System.out.println("=================Checking USB Devices...");
        printUsbDevices(hal.getUsbDevices(true));
    }

    public static Map<String, Object> getCpuInfo(Sensors sensors, CentralProcessor centralProcessor) {
        long[] prevTicks = centralProcessor.getSystemCpuLoadTicks();
        Util.sleep(300);
        long[] ticks = centralProcessor.getSystemCpuLoadTicks();
        long nice = ticks[TickType.NICE.getIndex()] - prevTicks[TickType.NICE.getIndex()];
        long irq = ticks[TickType.IRQ.getIndex()] - prevTicks[TickType.IRQ.getIndex()];
        long softirq = ticks[TickType.SOFTIRQ.getIndex()] - prevTicks[TickType.SOFTIRQ.getIndex()];
        long steal = ticks[TickType.STEAL.getIndex()] - prevTicks[TickType.STEAL.getIndex()];
        long cSys = ticks[TickType.SYSTEM.getIndex()] - prevTicks[TickType.SYSTEM.getIndex()];
        long user = ticks[TickType.USER.getIndex()] - prevTicks[TickType.USER.getIndex()];
        long iowait = ticks[TickType.IOWAIT.getIndex()] - prevTicks[TickType.IOWAIT.getIndex()];
        long idle = ticks[TickType.IDLE.getIndex()] - prevTicks[TickType.IDLE.getIndex()];
        long totalCpu = user + nice + cSys + idle + iowait + irq + softirq + steal;
//        System.err.println("cpu核数:" + centralProcessor.getLogicalProcessorCount());
//        System.err.println("cpu系统使用率:" + new DecimalFormat("#.##%").format(cSys * 1.0 / totalCpu));
//        System.err.println("cpu用户使用率:" + new DecimalFormat("#.##%").format(user * 1.0 / totalCpu));
//        System.err.println("cpu当前等待率:" + new DecimalFormat("#.##%").format(iowait * 1.0 / totalCpu));
//        System.err.println("cpu当前空闲率:" + new DecimalFormat("#.##%").format(idle * 1.0 / totalCpu));
//        System.err.format("CPU load: %.1f%% (counting ticks)%n", centralProcessor.getSystemCpuLoadBetweenTicks(ticks) * 100);
//        System.err.format("CPU load: %.1f%% (OS MXBean)%n", centralProcessor.getSystemCpuLoad() * 100);
        Map<String, Object> map = new HashMap<>();
//        map.put("温度", sensors.getCpuTemperature());
        map.put("CPU系统占用", new DecimalFormat("#.##%").format((cSys * 1.0 / totalCpu)));
        map.put("CPU用户占用", new DecimalFormat("#.##%").format((user * 1.0 / totalCpu)));
        map.put("CPU空闲", new DecimalFormat("#.##%").format(idle * 1.0 / totalCpu));
        map.put("CPU型号", centralProcessor.getProcessorIdentifier().getIdentifier());
        map.put("CPU制程", centralProcessor.getPhysicalProcessorCount() + "核" + centralProcessor.getLogicalProcessorCount() + "线程");
        map.put("CPU使用情况", new DecimalFormat("#.##").format(100 - (idle * 100.0 / totalCpu)));
        return map;
    }

    public static Map getMemoryInfo(GlobalMemory memory) {
        Map map = new HashMap();
        map.put("内存空闲", FormatUtil.formatBytes(memory.getAvailable()));
        map.put("内存已用", FormatUtil.formatBytes(memory.getTotal() - memory.getAvailable()));
        map.put("内存总共", FormatUtil.formatBytes(memory.getTotal()));
        map.put("内存使用情况", new DecimalFormat("#.##").format((memory.getTotal() - memory.getAvailable()) * 100.d / memory.getTotal()));
        return map;
    }

    public static Map<String, Object> getFileSystemInfo(FileSystem fileSystem) {
        List<OSFileStore> fsArray = fileSystem.getFileStores();
        Map<String, Object> 文件系统 = new HashMap<>();
        List 磁盘s = new ArrayList();
        long 大小 = 0;
        int i = 0;
        for (OSFileStore fs : fsArray) {
            Map map = new HashMap();
            map.put("id", i++);
            map.put("磁盘名称", fs.getName());
            map.put("磁盘挂载路径", fs.getMount());
            map.put("磁盘文件系统", fs.getType());
            map.put("磁盘容量", FormatUtil.formatBytes(fs.getTotalSpace()));
            map.put("磁盘已用", FormatUtil.formatBytes(fs.getTotalSpace() - fs.getUsableSpace()));
            map.put("磁盘空闲", FormatUtil.formatBytes(fs.getUsableSpace()));
            map.put("磁盘使用情况", new DecimalFormat("#.##").format((fs.getTotalSpace() - fs.getUsableSpace()) * 100.d / fs.getTotalSpace()));
            磁盘s.add(map);
            大小 += fs.getTotalSpace();
        }
        文件系统.put("磁盘", 磁盘s);
        文件系统.put("磁盘总容量", FormatUtil.formatBytes(大小));
        return 文件系统;
    }

    public static List getNetworkInterfacesInfo(List<NetworkIF> networkIFs) {
        List 网络信息 = new ArrayList();
        int i = 0;
        for (NetworkIF net : networkIFs) {
            Map map = new HashMap();
            map.put("id", i++);
            map.put("网络名称", net.getName());
            map.put("网络描述", net.getDisplayName());
            map.put("MAC", net.getMacaddr());
            map.put("IPv4", StrUtil.join(net.getIPv4addr()));
            map.put("IPv6", StrUtil.join(net.getIPv6addr()));
            网络信息.add(map);
        }
        return 网络信息;
    }


    private static void printComputerSystem(final ComputerSystem computerSystem) {

        System.out.println("制造商: " + computerSystem.getManufacturer());
        System.out.println("模型: " + computerSystem.getModel());
        System.out.println("序列号: " + computerSystem.getSerialNumber());
        final Firmware firmware = computerSystem.getFirmware();
        System.out.println("固件:");
        System.out.println("  制造商: " + firmware.getManufacturer());
        System.out.println("  名称: " + firmware.getName());
        System.out.println("  描述: " + firmware.getDescription());
        System.out.println("  版本: " + firmware.getVersion());
        System.out.println("  发布时间: " + (firmware.getReleaseDate() == null ? "unknown"
                : firmware.getReleaseDate() == null ? "unknown" : firmware.getReleaseDate()));
        final Baseboard baseboard = computerSystem.getBaseboard();
        System.out.println("baseboard:");
        System.out.println("  制造商: " + baseboard.getManufacturer());
        System.out.println("  模型: " + baseboard.getModel());
        System.out.println("  版本: " + baseboard.getVersion());
        System.out.println("  序列号: " + baseboard.getSerialNumber());
    }

    private static void printProcessor(CentralProcessor processor) {
        System.out.println(processor);
        System.out.println(" " + processor.getPhysicalPackageCount() + " physical CPU package(s)");
        System.out.println(" " + processor.getPhysicalProcessorCount() + " physical CPU core(s)");
        System.out.println(" " + processor.getLogicalProcessorCount() + " logical CPU(s)");

        System.out.println("Identifier: " + processor.getProcessorIdentifier().getIdentifier());
        System.out.println("ProcessorID: " + processor.getProcessorIdentifier().getProcessorID());
    }


    private static void printMemory(GlobalMemory memory) {
        System.out.println("内存: " + FormatUtil.formatBytes(memory.getAvailable()) + "/"
                + FormatUtil.formatBytes(memory.getTotal()));
        System.out.println("Swap used: " + FormatUtil.formatBytes(memory.getVirtualMemory().getSwapUsed()) + "/"
                + FormatUtil.formatBytes(memory.getVirtualMemory().getSwapTotal()));
    }

    private static void printCpu(OperatingSystem os, CentralProcessor processor) {
        System.out.println("Uptime: " + FormatUtil.formatElapsedSecs(os.getSystemUptime()));
        System.out.println(
                "Context Switches/Interrupts: " + processor.getContextSwitches() + " / " + processor.getInterrupts());

        long[] prevTicks = processor.getSystemCpuLoadTicks();
        System.out.println("CPU, IOWait, and IRQ ticks @ 0 sec:" + Arrays.toString(prevTicks));
        // Wait a second...
        Util.sleep(1000);
        long[] ticks = processor.getSystemCpuLoadTicks();
        System.out.println("CPU, IOWait, and IRQ ticks @ 1 sec:" + Arrays.toString(ticks));
        long user = ticks[TickType.USER.getIndex()] - prevTicks[TickType.USER.getIndex()];
        long nice = ticks[TickType.NICE.getIndex()] - prevTicks[TickType.NICE.getIndex()];
        long sys = ticks[TickType.SYSTEM.getIndex()] - prevTicks[TickType.SYSTEM.getIndex()];
        long idle = ticks[TickType.IDLE.getIndex()] - prevTicks[TickType.IDLE.getIndex()];
        long iowait = ticks[TickType.IOWAIT.getIndex()] - prevTicks[TickType.IOWAIT.getIndex()];
        long irq = ticks[TickType.IRQ.getIndex()] - prevTicks[TickType.IRQ.getIndex()];
        long softirq = ticks[TickType.SOFTIRQ.getIndex()] - prevTicks[TickType.SOFTIRQ.getIndex()];
        long steal = ticks[TickType.STEAL.getIndex()] - prevTicks[TickType.STEAL.getIndex()];
        long totalCpu = user + nice + sys + idle + iowait + irq + softirq + steal;

        System.out.format(
                "User: %.1f%% Nice: %.1f%% System: %.1f%% Idle: %.1f%% IOwait: %.1f%% IRQ: %.1f%% SoftIRQ: %.1f%% Steal: %.1f%%%n",
                100d * user / totalCpu, 100d * nice / totalCpu, 100d * sys / totalCpu, 100d * idle / totalCpu,
                100d * iowait / totalCpu, 100d * irq / totalCpu, 100d * softirq / totalCpu, 100d * steal / totalCpu);
        System.out.format("CPU load: %.1f%% (counting ticks)%n", processor.getSystemCpuLoadBetweenTicks(ticks) * 100);
//        System.out.format("CPU load: %.1f%% (OS MXBean)%n", processor.getSystemCpuLoad() * 100);
        double[] loadAverage = processor.getSystemLoadAverage(3);
        System.out.println("CPU load averages:" + (loadAverage[0] < 0 ? " N/A" : String.format(" %.2f", loadAverage[0]))
                + (loadAverage[1] < 0 ? " N/A" : String.format(" %.2f", loadAverage[1]))
                + (loadAverage[2] < 0 ? " N/A" : String.format(" %.2f", loadAverage[2])));
        // per core CPU
        StringBuilder procCpu = new StringBuilder("CPU load per processor:");
        long[][] procTicks = processor.getProcessorCpuLoadTicks();
        double[] load = processor.getProcessorCpuLoadBetweenTicks(procTicks);
        for (double avg : load) {
            procCpu.append(String.format(" %.1f%%", avg * 100));
        }
        System.out.println(procCpu.toString());
    }

    private static void printProcesses(OperatingSystem os, GlobalMemory memory) {
        System.out.println("Processes: " + os.getProcessCount() + ", Threads: " + os.getThreadCount());
        // Sort by highest CPU
        List<OSProcess> procs = os.getProcesses();

        System.out.println("   PID  %CPU %MEM       VSZ       RSS Name");
        for (int i = 0; i < procs.size() && i < 50; i++) {
            OSProcess p = procs.get(i);
            System.out.format(" %5d %5.1f %4.1f %9s %9s %s%n", p.getProcessID(),
                    100d * (p.getKernelTime() + p.getUserTime()) / p.getUpTime(),
                    100d * p.getResidentSetSize() / memory.getTotal(), FormatUtil.formatBytes(p.getVirtualSize()),
                    FormatUtil.formatBytes(p.getResidentSetSize()), p.getName());
        }
    }

    private static void printSensors(Sensors sensors) {
        System.out.println("传感器:");
        System.out.format(" CPU 温度: %.1f°C%n", sensors.getCpuTemperature());
        System.out.println(" 风扇转速: " + Arrays.toString(sensors.getFanSpeeds()));
        System.out.format(" CPU 电压: %.1fV%n", sensors.getCpuVoltage());
    }

    private static void printPowerSources(List<PowerSource> powerSources) {
        StringBuilder sb = new StringBuilder("电源: ");
        if (powerSources == null || powerSources.size() == 0) {
            sb.append("Unknown");
        } else {
            double timeRemaining = powerSources.get(0).getTimeRemainingEstimated();
            if (timeRemaining < -1d) {
                sb.append("Charging");
            } else if (timeRemaining < 0d) {
                sb.append("Calculating time remaining");
            } else {
                sb.append(String.format("%d:%02d remaining", (int) (timeRemaining / 3600),
                        (int) (timeRemaining / 60) % 60));
            }
        }
        for (PowerSource pSource : powerSources) {
            sb.append(String.format("%n %s @ %.1f%%", pSource.getName(), pSource.getRemainingCapacityPercent() * 100d));
        }
        System.out.println(sb.toString());
    }

    public static Map getDiskInfo(HWDiskStore[] diskStores) {
        Map map = new HashMap();
        for (HWDiskStore diskStore : diskStores) {
            boolean readwrite = diskStore.getReads() > 0 || diskStore.getWrites() > 0;
            Map<String, Object> 盘 = new HashMap<>();
            盘.put("磁盘名字", diskStore.getName());
            盘.put("磁盘大小", diskStore.getSize());
            List<HWPartition> partitions = diskStore.getPartitions();
            if (partitions == null) {
                continue;
            }
            List 分区 = new ArrayList();
            for (HWPartition partition : partitions) {
                Map 分区信息 = new HashMap();
                分区信息.put("名字", partition.getName());
                分区信息.put("标识", partition.getMountPoint());
                分区信息.put("大小", FormatUtil.formatBytesDecimal(partition.getSize()));
                分区.add(分区信息);
            }
            map.put("分区信息", 分区);
        }
        return map;
    }

    private static void printDisks(List<HWDiskStore> diskStores) {
        System.out.println("硬盘:");
        for (HWDiskStore disk : diskStores) {
            boolean readwrite = disk.getReads() > 0 || disk.getWrites() > 0;
            System.out.format(" %s: (model: %s - S/N: %s) size: %s, reads: %s (%s), writes: %s (%s), xfer: %s ms%n",
                    disk.getName(), disk.getModel(), disk.getSerial(),
                    disk.getSize() > 0 ? FormatUtil.formatBytesDecimal(disk.getSize()) : "?",
                    readwrite ? disk.getReads() : "?", readwrite ? FormatUtil.formatBytes(disk.getReadBytes()) : "?",
                    readwrite ? disk.getWrites() : "?", readwrite ? FormatUtil.formatBytes(disk.getWriteBytes()) : "?",
                    readwrite ? disk.getTransferTime() : "?");
            List<HWPartition> partitions = disk.getPartitions();
            if (partitions == null) {
                // TODO Remove when all OS's implemented
                continue;
            }
            for (HWPartition part : partitions) {
                System.out.format(" |-- %s: %s (%s) Maj:Min=%d:%d, size: %s%s%n", part.getIdentification(),
                        part.getName(), part.getType(), part.getMajor(), part.getMinor(),
                        FormatUtil.formatBytesDecimal(part.getSize()),
                        part.getMountPoint().isEmpty() ? "" : " @ " + part.getMountPoint());
            }
        }
    }


    private static void printFileSystem(FileSystem fileSystem) {
        System.out.println("文件系统:");

        System.out.format(" File Descriptors: %d/%d%n", fileSystem.getOpenFileDescriptors(),
                fileSystem.getMaxFileDescriptors());

        List<OSFileStore> fsArray = fileSystem.getFileStores();
        for (OSFileStore fs : fsArray) {
            long usable = fs.getUsableSpace();
            long total = fs.getTotalSpace();
            System.out.format(
                    " %s (%s) [%s] %s of %s free (%.1f%%) is %s "
                            + (fs.getLogicalVolume() != null && fs.getLogicalVolume().length() > 0 ? "[%s]" : "%s")
                            + " and is mounted at %s%n",
                    fs.getName(), fs.getDescription().isEmpty() ? "file system" : fs.getDescription(), fs.getType(),
                    FormatUtil.formatBytes(usable), FormatUtil.formatBytes(fs.getTotalSpace()), 100d * usable / total,
                    fs.getVolume(), fs.getLogicalVolume(), fs.getMount());
        }
    }


    private static void printNetworkInterfaces(List<NetworkIF> networkIFs) {
        System.out.println("网络信息:");
        for (NetworkIF net : networkIFs) {
            System.out.format(" 名称: %s (%s)%n", net.getName(), net.getDisplayName());
            System.out.format("   MAC地址: %s %n", net.getMacaddr());
            System.out.format("   MTU: %s, Speed: %s %n", net.getMTU(), FormatUtil.formatValue(net.getSpeed(), "bps"));
            System.out.format("   IPv4IPv4: %s %n", Arrays.toString(net.getIPv4addr()));
            System.out.format("   IPv6IPv6: %s %n", Arrays.toString(net.getIPv6addr()));
            boolean hasData = net.getBytesRecv() > 0 || net.getBytesSent() > 0 || net.getPacketsRecv() > 0
                    || net.getPacketsSent() > 0;
            System.out.format("   Traffic: received %s/%s%s; transmitted %s/%s%s %n",
                    hasData ? net.getPacketsRecv() + " packets" : "?",
                    hasData ? FormatUtil.formatBytes(net.getBytesRecv()) : "?",
                    hasData ? " (" + net.getInErrors() + " err)" : "",
                    hasData ? net.getPacketsSent() + " packets" : "?",
                    hasData ? FormatUtil.formatBytes(net.getBytesSent()) : "?",
                    hasData ? " (" + net.getOutErrors() + " err)" : "");
        }
    }

    private static void printNetworkParameters(NetworkParams networkParams) {
        System.out.println("网络参数:");
        System.out.format(" Host name: %s%n", networkParams.getHostName());
        System.out.format(" Domain name: %s%n", networkParams.getDomainName());
        System.out.format(" DNS servers: %s%n", Arrays.toString(networkParams.getDnsServers()));
        System.out.format(" IPv4 Gateway: %s%n", networkParams.getIpv4DefaultGateway());
        System.out.format(" IPv6 Gateway: %s%n", networkParams.getIpv6DefaultGateway());
    }

    private static void printDisplays(List<Display> displays) {
        System.out.println("Displays:");
        int i = 0;
        for (Display display : displays) {
            System.out.println(" Display " + i + ":");
            System.out.println(display.toString());
            i++;
        }
    }

    private static void printUsbDevices(List<UsbDevice> usbDevices) {
        System.out.println("USB Devices:");
        for (UsbDevice usbDevice : usbDevices) {
            System.out.println(usbDevice.toString());
        }
    }
}
