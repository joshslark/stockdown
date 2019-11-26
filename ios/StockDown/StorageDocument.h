//
//  StorageDocument.h
//  StockDown
//
//  Created by Joshua Clark on 11/20/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface StorageDocument : UIDocument 
@property(nonatomic, strong) NSData *documentContents;
@end
