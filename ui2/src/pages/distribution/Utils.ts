import {Status as AuctionStatus} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Auction/Model';
import {Bid, Status as BidStatus,} from '@daml.js/da-marketplace/lib/Marketplace/Distribution/Bidding/Model/module';

export const getAuctionStatus = (auctionStatus: AuctionStatus): string => {
  switch (auctionStatus.tag) {
    case 'PartiallyAllocated':
      return 'Partially Allocated';
    case 'FullyAllocated':
      return 'Fully Allocated';
    case 'NoValidBids':
      return 'No valid Bids';
    default:
      return auctionStatus.tag;
  }
};

export const getBidStatus = (bidStatus: BidStatus): string => {
  switch (bidStatus.tag) {
    case 'PartialAllocation':
      return 'Partial Allocation';
    case 'FullAllocation':
      return 'Full Allocation';
    case 'NoAllocation':
      return 'No Allocation';
    default:
      return bidStatus.tag;
  }
};

export const getBidAllocation = (bid: Bid): string => {
  switch (bid.status.tag) {
    case 'PartialAllocation':
      return (
        bid.status.value.quantity +
        ' ' +
        bid.assetId.label +
        ' @ ' +
        bid.status.value.price +
        ' ' +
        bid.quotedAssetId.label
      );
    case 'FullAllocation':
      return (
        bid.details.quantity +
        ' ' +
        bid.assetId.label +
        ' @ ' +
        bid.status.value.price +
        ' ' +
        bid.quotedAssetId.label
      );
    default:
      return '';
  }
};
