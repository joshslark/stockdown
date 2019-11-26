//
//  StorageDocument.m
//  StockDown
//
//  Created by Joshua Clark on 11/20/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "StorageDocument.h"

@implementation StorageDocument

- (BOOL)loadFromContents:(id)contents ofType:(NSString *)typeName error:(NSError **)outError {
  if ([contents length] > 0) {
    self.documentContents = [[NSData alloc] initWithData:(NSData *)contents];
    return YES;
  } else {
    self.documentContents = [[NSData alloc] init];
    return NO;
  }
}

-(id)contentsForType:(NSString *)typeName error:(NSError **)outError {
  if (!self.documentContents) {
    self.documentContents = [[NSData alloc] init];
  }
  return self.documentContents;
}
@end
