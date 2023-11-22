package com.anzhilai.core.toolkit.image;

import net.coobird.thumbnailator.Thumbnails;

import java.io.File;
import java.io.IOException;

//缩略图
public class ThumbUtil {

    public static void CreateThumb(String orgfile,String targetfile) throws IOException {
        File f = new File(orgfile);
        if(f.exists()) {

            Thumbnails.of(orgfile)
                    .size(40, 40)
                    .toFile(targetfile);
        }
    }
}
