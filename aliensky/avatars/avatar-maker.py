
import re
import Image

class Avatar(object):
    def __init__(self):
        self._myImage = Image.open("blankAvatar.png")

    def addChunk(self, imgFileName, colorSwaps):
        chunkImg = Image.open(imgFileName)
        # chunkImg must be saved in indexed color mode!!!

        # by convention, maskFileName is imgFileName s/\.png/-mask\.png/
        p = re.compile(r'\.png')
        maskFileName = p.sub( '-mask.png', imgFileName)
        print "MaskFileName is %s." % maskFileName
        if len(colorSwaps.keys()) > 0:
            oldPalette = chunkImg.getpalette()
            newPalette = oldPalette[:]
            for index in colorSwaps.keys():
                newPalette[index * 3] = colorSwaps[index][0]
                newPalette[index * 3 + 1] = colorSwaps[index][1]
                newPalette[index * 3 + 2] = colorSwaps[index][2]
            chunkImg.putpalette(newPalette) 
        chunkImg = chunkImg.convert()
        mask = Image.open(maskFileName)
        # mask must be saved as 1-bit B&W bitmap
        self._myImage = Image.composite(self._myImage, chunkImg, mask)

    def saveImage(self, outFileName):
        # TODO apply transparency color from original blankAvatar.png to output file
        # How do we do that?
        self._myImage.save(outFileName)

if __name__ == "__main__":
    
    me = Avatar()
    # hair colors 2, 3, and 4 are highlight, base color, shadow.
    me.addChunk("hair-back-1.png",
                {2: (0, 200, 0), 3:(0, 150, 0), 4:(0, 100, 0)})
    me.addChunk("arms-1.png", {})
    me.addChunk("left-hand-detector.png", {})
    me.addChunk("left-hand-1.png", {})
    me.addChunk("right-hand-helmet-1.png", {})
    me.addChunk("legs-1.png", {})
    me.addChunk("feet-1.png", {})
    me.addChunk("torso-1.png",{})
    me.addChunk("head-2.png", {})
    me.addChunk("eyes-1.png", {2: (0, 0, 255)})
    me.addChunk("mouth-1.png", {})
    # hair colors 5 and 6 are headband and headband shadow
    me.addChunk("hair-front-1.png",
                {2: (0, 200, 0), 3: (0, 150, 0), 4:(0, 100, 0), 5: (255, 255, 0), 6: (155, 155, 0)})

    me.saveImage("composite.png")
    

    # yellows on suit are 2, 3, 4 (light to dark)
    # blues on suit are 5, 6, 7, 8 (light to dark)
    # Except... legs only have on yellow (2) and 3 blues (3, 4, 5)
    # L hand has only yellows 2, 3, 4


