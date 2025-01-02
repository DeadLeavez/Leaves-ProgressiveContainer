# Progressive Container
Adds crafts for progressively getting a bigger container.

The recipes are quite expensive by default. It's simply the way I prefer things. Can be changed in the config file.

the crafts are as following by default.

```
pouch: 4xbolts, 4xnuts, pistol case, 2xduct tape, 2xblue tape
alpha: 2xpouch, 4xmetal parts, 2xkektape, magazine case, 2xpoexeram
beta:  2xalpha, 4xscrews, 4xnails, ammo case, bit coin
epsi:  2xbeta, virtex, scav junk box, key tool, 2xgraphics card, shturman key, golden tt, sledge hammer
gamma: 2xepsi, Tagilla cap, Sanitar Bag, Killa Helmet, 1xweapon case, 2xAESA, yellow keycard, tank battery
kappa: 2xgamma, 4xbig pipe pipe, 2xaspect company key, 2 x far foward, red keycard, violet keycard, blue keycard
```

I personally run with these container sizes.

```
pouch: 2x2
alpha: 2x3
beta:  3x3
epsi:  3x4
gamma: 3x5
kappa: 3x6
```

You need another mod (like SVM) to edit container sizes.

Inspired by part of Trap's progressive stash, but no code has been copied. Still, huge thanks for the amazing idea!

# Changelog
## 1.0.0
Initial Release

## 1.1.0
- Fixed a bug where crafts that were left going after shutting the server down could cause the craft to disappear. 
- also fixed the issue of favorite crafts disappearing.

- Also added a feature that allow you to remove the alpha/beta containers from peacekeeper. (Enabled by default)


If you have messages like ``Could not find recipe: <ID> for area type`` they are caused by the aforementioned bug. It is completely harmless, but if you want to remove the messages. remove crafting entries in the ``profile.json`` matching the ID the message is outputting. I HIGHLY RECOMMEND YOU NOT TO DO THAT BECAUSE IF DONE IMPROPERLY YOU CAN AND WILL PERMANENTLY BRICK YOUR PROFILE.


## 1.2.0

- Updated version for 3.8.0
- Adjusted the config file to new format that allows comments for easier editing.

## 1.2.1

- Allow for changing where the crafts are being done.

## 1.2.2

- Updated name and folders to match package.json standards.
- Updated for 3.9.0

## 1.2.3

- Updated for 3.10.x

## 1.2.4

- Added support for unheard container (not enabled by default right now)
- Updated S_Gamez's community config. Thanks.