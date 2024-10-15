# Co-llection backend

The backend serves as a processing pipeline for the files uploaded to Co-llection.

## Dependencies

- ImageMagick
- ffmpeg
- GhostScript

## Usage

`$ node main.js`

## Conversion processes

### images
```
convert ${inputFilePath} -resize 1500x1500 -quality 70 ${outputFilePath}
convert ${inputFilePath} -resize 150x150 -quality 70 ${outputFilePath}
```

### videos
```
ffmpeg -y -i ${inputFilePath} -vcodec libx264 -crf 23 -preset medium -acodec aac -b:a 128k -vf  "scale=1280:720:force_original_aspect_ratio=decrease, pad=ceil(iw/2)*2:ceil(ih/2)*2" -movflags +faststart ${outputFilePath}
ffmpeg -y -i ${inputFilePath} -ss 00:00:01.000 -vframes 1 -vf "scale=150:150:force_original_aspect_ratio=decrease, pad=ceil(iw/2)*2:ceil(ih/2)*2" ${outputFilePath}
```

### pdf
```
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/default -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath}  ${inputFilePath}
convert -thumbnail x150 "${inputFilePath}[0]" ${outputFilePath}
```

## TODO:
[ ] Run as two separate processes, one that only processes videos, one for other file types
