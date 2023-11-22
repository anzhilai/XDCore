package com.anzhilai.core.toolkit;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class FileDeleteThread extends Thread {
    public static final String lock = "lock";
    public static List<String> listDirs = new ArrayList<>();
    public static FileDeleteThread fileDeleteThread;

    public static void DeleteFile(String path) {
        File file = new File(path);
        if (file.exists()) {
            if (file.isDirectory()) {
                File file2 = new File(file.getPath() + ".delete");
                if (file.renameTo(file2)) {
                    file = file2;
                }
                synchronized (lock) {
                    listDirs.add(file.getPath());
                    if (fileDeleteThread == null) {
                        fileDeleteThread = new FileDeleteThread();
                        fileDeleteThread.start();
                    }
                }
            } else {
                file.delete();
            }
        }
    }

    public String getPath() {
        String path = "";
        synchronized (lock) {
            if (listDirs.size() > 0) {
                path = listDirs.remove(0);
            }
        }
        return path;
    }

    @Override
    public void run() {
        super.run();
        while (true) {
            String path = getPath();
            if (StrUtil.isNotEmpty(path)) {
                FileUtil.delFolder(path);
            } else {
                break;
            }
        }
        synchronized (lock) {
            fileDeleteThread = null;
        }
    }
}
