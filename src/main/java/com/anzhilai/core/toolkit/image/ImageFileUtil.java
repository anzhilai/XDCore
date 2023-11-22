package com.anzhilai.core.toolkit.image;

import com.anzhilai.core.toolkit.DateUtil;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;
import java.io.*;
import java.util.Date;
import java.util.Iterator;
import java.util.Random;

public class ImageFileUtil {
    // 水印透明度
    private static float alpha = 0.6f;
    // 水印横向位置
    private static int positionWidth = 5;
    // 水印纵向位置水印纵向位置
    private static int positionHeight = 20;
    // 水印图片旋转角度
    private static int degree = 0;

    public static String getExtensionName(String filename) {
        if ((filename != null) && (filename.length() > 0)) {
            int dot = filename.lastIndexOf('.');
            if ((dot > -1) && (dot < (filename.length() - 1))) {
                return filename.substring(dot + 1);
            }
        }
        return filename;
    }

    public static String getFileNameWithDate(String filename) {
        StringBuilder sb = new StringBuilder();
        if ((filename != null) && (filename.length() > 0)) {
            int dot = filename.lastIndexOf('.');
            if ((dot > -1) && (dot < (filename.length()))) {
                filename = filename.substring(0, dot);
                String[] ss = filename.split("_");
                if (ss[0] != null) {
                    sb.append(ss[0].substring(0, 4));
                    sb.append("-");
                    sb.append(ss[0].substring(4, 6));
                    sb.append("-");
                    sb.append(ss[0].substring(6, 8));
                    sb.append(" ");
                }
                if (ss[1] != null) {
                    sb.append(ss[1].replaceAll("-", ":"));
                }
                return sb.toString();
            }
        }
        return sb.toString();
    }

    /***
     * 保存内容到图片文件
     * @param root
     * @param dir
     * @param cnt
     * @return 路径(包括文件名)
     */
    public static String saveFileAsImg(String root, String dir, byte[] cnt) {
        FileOutputStream fout = null;
        String rs = null;
        try {
            String rootFile = root + "/" + dir;
            String fullPath = filePathAddDate(rootFile);
            String localFilePath = fullPath + "/" + getRandomChar(6) + "_" + getRandomNumber(6) + ".jpg";

            fout = new FileOutputStream(localFilePath);
            fout.write(cnt);
            fout.flush();
            rs = localFilePath.replace(root, "");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fout != null) {
                try {
                    fout.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return rs;
    }

    /***
     * 保存内容到图片文件-加水印
     * @param root
     * @param dir
     * @param cnt
     * @return 路径(包括文件名)
     */
    public static String saveFileAsMarkLogoImg(String root, String dir, String icon, byte[] cnt) {
        String rs = null;
        try {
            String rootFile = root + "/" + dir;
            String fullPath = filePathAddDate(rootFile);
            String localFilePath = fullPath + "/" + getRandomChar(6) + "_" + getRandomNumber(6) + ".jpg";
            String iconPath = root + "/" + icon;
            // 打水印并保存图片
            markImageByIcon(iconPath, localFilePath, cnt);
            rs = localFilePath.replace(root, "");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rs;
    }

    public static void drawRecOnImage(File srcFile, Rectangle rect, String targerfile) {
        OutputStream os = null;
        try {
            BufferedImage srcImg = ImageIO.read(srcFile);
            //BufferedImage image = new BufferedImage(srcImg.getWidth(null), srcImg.getHeight(null), BufferedImage.TYPE_INT_RGB);

            Graphics g = srcImg.getGraphics();
            g.drawImage(srcImg, srcImg.getWidth(null), srcImg.getHeight(null), null);
            g.setColor(Color.RED);//画笔颜色

            g.drawRect(rect.x, rect.y, rect.width, rect.height);//矩形框(原点x坐标，原点y坐标，矩形的长，矩形的宽)
            //g.dispose();
            os = new FileOutputStream(targerfile);//输出图片的地址
            ImageIO.write(srcImg, "jpeg", os);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (null != os)
                    os.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 给图片添加水印图片、可设置水印图片旋转角度
     */
    public static void markImageByIcon(String iconPath, String targerPath, byte[] cnt) {
        OutputStream os = null;
        try {
            Image srcImg = ImageIO.read(new ByteArrayInputStream(cnt));
            BufferedImage buffImg = new BufferedImage(srcImg.getWidth(null), srcImg.getHeight(null), BufferedImage.TYPE_INT_RGB);
            // 1、得到画笔对象
            Graphics2D g = buffImg.createGraphics();
            // 2、设置对线段的锯齿状边缘处理
            g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g.drawImage(srcImg.getScaledInstance(srcImg.getWidth(null), srcImg.getHeight(null), Image.SCALE_SMOOTH), 0, 0, null);
            // 3、设置水印旋转
            if (0 != degree) {
                g.rotate(Math.toRadians(degree), (double) buffImg.getWidth() / 2, (double) buffImg.getHeight() / 2);
            }
            // 4、水印图片的路径 水印图片一般为gif或者png的，这样可设置透明度
            ImageIcon imgIcon = new ImageIcon(iconPath);
            // 5、得到Image对象。
            Image img = imgIcon.getImage();
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));
            // 6、水印图片的位置
            g.drawImage(img, positionWidth, positionHeight, null);
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER));
            // 7、释放资源
            g.dispose();
            // 8、生成图片
            os = new FileOutputStream(targerPath);
            ImageIO.write(buffImg, "jpg", os);
            System.out.println("图片完成添加水印图片");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (null != os)
                    os.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 缩放图片(压缩图片质量，改变图片尺寸)
     * 若原图宽度小于新宽度，则宽度不变！
     *
     * @param maxWidth 新的宽度
     * @param quality  图片质量参数 0.7f 相当于70%质量
     */
    public static void imageResize(File originalFile, File resizedFile,
                                   int maxWidth, int maxHeight, float quality) throws IOException {

        if (quality > 1) {
            throw new IllegalArgumentException(
                    "图片质量需设置在0.1-1范围");
        }

        ImageIcon ii = new ImageIcon(originalFile.getCanonicalPath());
        Image i = ii.getImage();
        Image resizedImage = null;

        int iWidth = i.getWidth(null);
        int iHeight = i.getHeight(null);

        int newWidth = maxWidth;
        if (iWidth < maxWidth) {
            newWidth = iWidth;
        }


        if (iWidth >= iHeight) {
            resizedImage = i.getScaledInstance(newWidth, (newWidth * iHeight)
                    / iWidth, Image.SCALE_SMOOTH);
        }


        int newHeight = maxHeight;
        if (iHeight < maxHeight) {
            newHeight = iHeight;
        }

        if (resizedImage == null && iHeight >= iWidth) {
            resizedImage = i.getScaledInstance((newHeight * iWidth) / iHeight,
                    newHeight, Image.SCALE_SMOOTH);
        }

        // This code ensures that all the pixels in the image are loaded.
        Image temp = new ImageIcon(resizedImage).getImage();

        // Create the buffered image.
        BufferedImage bufferedImage = new BufferedImage(temp.getWidth(null),
                temp.getHeight(null), BufferedImage.TYPE_INT_RGB);

        // Copy image to buffered image.
        Graphics g = bufferedImage.createGraphics();

        // Clear background and paint the image.
        g.setColor(Color.white);
        g.fillRect(0, 0, temp.getWidth(null), temp.getHeight(null));
        g.drawImage(temp, 0, 0, null);
        g.dispose();

        // Soften.
        float softenFactor = 0.05f;
        float[] softenArray = {0, softenFactor, 0, softenFactor,
                1 - (softenFactor * 4), softenFactor, 0, softenFactor, 0};
        Kernel kernel = new Kernel(3, 3, softenArray);
        ConvolveOp cOp = new ConvolveOp(kernel, ConvolveOp.EDGE_NO_OP, null);
        bufferedImage = cOp.filter(bufferedImage, null);

        // Write the jpeg to a file.
        FileOutputStream out = new FileOutputStream(resizedFile);

//        // Encodes image as a JPEG data stream
//        JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
//
//        JPEGEncodeParam param = encoder
//                .getDefaultJPEGEncodeParam(bufferedImage);
//
//        param.setQuality(quality, true);
//
//        encoder.setJPEGEncodeParam(param);
//        encoder.encode(bufferedImage);
//        ImageIO.write(bufferedImage,"jpg",out);
        Iterator<ImageWriter> iter = ImageIO.getImageWritersByFormatName("jpg");
        if (iter.hasNext()) {
            ImageWriter writer = iter.next();
            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(quality);
            writer.setOutput(out);
            writer.write(null, new IIOImage(bufferedImage, null, null), param);
            writer.dispose();
        }
        out.close();
    } // Example usage

    public static void main(String[] args) {
        //String s = FileUtil.getFileNameWithDate("20160704_18-07-38.mp4");
        //System.out.println(s);
        //System.out.println(ss[0].substring(4, 6));
        //System.out.println(ss[0].substring(6, 8));
        //System.out.println(ss[1].replaceAll("-", ":"));
        String root = "d:";
        String iconPath = "realname_id_watermark.jpg";//水印图片
        String dir = "idImg";
        String filePath = "d:/1.jpg";//原始图片
        byte[] buffer = null;
        try {
            File file = new File(filePath);
            FileInputStream fis = new FileInputStream(file);
            ByteArrayOutputStream bos = new ByteArrayOutputStream(1000);
            byte[] b = new byte[1024];
            int n;
            while ((n = fis.read(b)) != -1) {
                bos.write(b, 0, n);
            }
            fis.close();
            bos.close();
            buffer = bos.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("给图片添加水印图片开始...");
        // 给图片添加水印图片,水印图片旋转-45
        saveFileAsMarkLogoImg(root, dir, iconPath, buffer);
        System.out.println("给图片添加水印图片结束...");
    }

    public static String filePathAddDate(String filePath) {
        String path = filePath + "/" + DateUtil.ToString(new Date(), "yyyyMM") + "/" + DateUtil.ToString(new Date(), "yyyyMMdd");
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }
        return path;
    }

    public static String getRandomChar(int pwd_len) {
        int count = 0;
        char[] str = new char[]{'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
        StringBuffer pwd = new StringBuffer("");
        Random r = new Random();
        while (count < pwd_len) {
            int i = Math.abs(r.nextInt(str.length));
            if (i >= 0 && i < str.length) {
                pwd.append(str[i]);
                ++count;
            }
        }
        return pwd.toString();
    }

    public static String getRandomNumber(int pwd_len) {
        int count = 0;
        char[] str = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};
        StringBuffer pwd = new StringBuffer("");
        Random r = new Random();

        while (count < pwd_len) {
            int i = Math.abs(r.nextInt(str.length));
            if (i >= 0 && i < str.length) {
                pwd.append(str[i]);
                ++count;
            }
        }
        return pwd.toString();
    }
}
