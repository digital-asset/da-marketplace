import React from 'react';

import marketplaceLogo from './marketplace.svg';
// import lock from './lock.svg'

type IconProps = {
  size?: '24' | '32' | '48' | '64';
  color?: 'green' | 'blue';
};

export const ArrowRightIcon = () => (
  <svg className="icon arrow-right-icon" viewBox="0 0 13 12">
    <path
      className="fill-blue"
      d="M6.3,2.3L9,5H0.8C0.4,5,0,5.3,0,5.8s0.3,0.8,0.8,0.8H9L6.3,9.3C6.2,9.4,6.1,9.6,6.1,9.8s0.1,0.4,0.2,0.5
            c0.3,0.3,0.8,0.3,1.1,0l4-4c0.1-0.1,0.1-0.2,0.1-0.3c0.1-0.1,0.1-0.4,0-0.5c0-0.1-0.1-0.2-0.2-0.2l-4-4C7,1,6.5,1,6.2,1.3
            C6,1.5,6,2,6.3,2.3"
    />
  </svg>
);

export const CogIcon = () => (
  <svg className="icon cog-icon" viewBox="0 0 19 20">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.47311 7.07633C7.86133 7.07633 6.54968 8.38798 6.54968 9.99977C6.54968 11.6116 7.86133 12.9232 9.47311 12.9232C11.0849 12.9232 12.3966 11.6116 12.3966 9.99977C12.3966 8.38798 11.0849 7.07633 9.47311 7.07633ZM9.47311 13.8976C7.32341 13.8976 5.5752 12.1494 5.5752 9.99972C5.5752 7.85002 7.32341 6.10181 9.47311 6.10181C11.6228 6.10181 13.371 7.85002 13.371 9.99972C13.371 12.1494 11.6228 13.8976 9.47311 13.8976Z"
      fill="#B4F5A3"
    />
    <mask id="mask0" maskUnits="userSpaceOnUse" x="1" y="1" width="17" height="18">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.18408 1.25H17.7628V18.75H1.18408V1.25Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.4236 13.4069L15.5729 14.7663C15.3565 15.1113 14.9005 15.2155 14.5555 15.0002L13.2828 14.1816C13.2828 14.1816 13.2633 14.1816 13.2585 14.1865C12.5383 14.8374 11.6701 15.2798 10.7492 15.4952C10.7492 15.4952 10.758 16.5184 10.7794 16.5145L10.7619 17.0115C10.757 17.1421 10.719 17.2658 10.6508 17.374C10.6167 17.4286 10.5748 17.4792 10.526 17.525C10.3818 17.6595 10.1937 17.7307 9.99786 17.7229L8.39582 17.6654C8.19995 17.6585 8.01772 17.5747 7.88227 17.4295C7.74779 17.2843 7.67762 17.0972 7.68445 16.9014L7.70199 16.4122H7.70296L7.73999 15.3744C7.30537 15.234 6.88147 15.0382 6.47609 14.7858C6.04927 14.5178 5.67215 14.2021 5.34472 13.8503L4.45989 14.3999C4.46087 14.4009 4.46087 14.4009 4.46184 14.4018L4.43066 14.4184L4.04477 14.6221C3.87228 14.7137 3.67251 14.7322 3.48347 14.6747C3.29442 14.6162 3.13947 14.4886 3.04787 14.3161L2.29558 12.8992C2.10555 12.5396 2.24295 12.0933 2.60254 11.9013L3.02449 11.6772C3.02546 11.6821 3.65595 11.3946 3.9785 11.2777C3.76704 10.3665 3.77873 9.40373 4.03794 8.47895L4.06815 8.43022L2.72435 7.58827C2.40569 7.36414 2.31409 6.9266 2.52263 6.59236L3.37335 5.23393C3.58968 4.88897 4.04574 4.7847 4.39071 5.00103L5.69846 5.80303C6.41762 5.15695 7.28296 4.71746 8.19995 4.50405L8.17169 3.46525C8.16974 3.46623 8.16876 3.46623 8.16681 3.46623L8.18435 2.98873C8.19897 2.58237 8.54199 2.26177 8.94932 2.27736L10.5514 2.33485C10.7472 2.34168 10.9285 2.42548 11.0639 2.57068C11.1984 2.71588 11.2686 2.90395 11.2627 3.09885L11.2471 3.52762C11.2471 3.52762 11.1614 4.61319 11.2004 4.62488C11.6369 4.76521 12.0638 4.96108 12.4701 5.21542C12.8813 5.47268 13.2487 5.77574 13.5684 6.11291C13.5684 6.11291 14.4746 5.61398 14.4688 5.60813L14.9014 5.37815C15.0739 5.28655 15.2737 5.26804 15.4637 5.32651C15.6528 5.384 15.8077 5.51068 15.8993 5.68414L16.6506 7.10103C16.7422 7.27352 16.7607 7.47328 16.7033 7.66233C16.6828 7.72665 16.6555 7.78609 16.6214 7.84164C16.5542 7.94883 16.4596 8.03751 16.3437 8.0989L15.9071 8.33083C15.9052 8.32401 14.9852 8.79663 14.9852 8.79663C15.1909 9.737 15.1597 10.729 14.8654 11.6752L15.7941 12.142L16.1897 12.3905C16.5347 12.6059 16.6399 13.0619 16.4236 13.4069ZM16.7344 11.5202L16.0523 11.0924C16.1449 10.5262 16.1449 9.95715 16.0932 9.3939L16.8251 9.00508C17.6836 8.55 18.0139 7.48002 17.5579 6.61955L16.8065 5.20364C16.5863 4.78753 16.216 4.48252 15.7639 4.34414C15.3127 4.20674 14.8362 4.25059 14.42 4.4718L13.6931 4.85672C13.4758 4.67839 13.2594 4.49811 13.0148 4.34512C12.7693 4.19115 12.5159 4.06155 12.2596 3.94363L12.2879 3.13579C12.3045 2.66609 12.1368 2.21686 11.8153 1.87189C11.4937 1.52498 11.0581 1.32618 10.5884 1.30864L8.98538 1.25115C8.33345 1.22776 7.74974 1.56395 7.42523 2.0814C7.26639 2.33477 7.16992 2.63101 7.15823 2.95064L7.12899 3.76336C6.59693 3.96312 6.08727 4.22428 5.6166 4.55658L4.93544 4.12976C4.112 3.61426 3.02059 3.8647 2.50411 4.68911L1.65242 6.04753C1.13594 6.87194 1.38736 7.96434 2.21177 8.47984L2.89196 8.90666C2.79938 9.47478 2.78574 10.0478 2.83933 10.6139L2.12114 10.994C1.83854 11.145 1.61344 11.3604 1.45557 11.6147C1.13107 12.1312 1.08332 12.8036 1.38931 13.3805L2.14063 14.7964C2.36086 15.2125 2.73117 15.5175 3.18235 15.6559C3.63353 15.7943 4.11103 15.7495 4.52713 15.5292L5.24045 15.1501C5.45873 15.3295 5.68579 15.501 5.93136 15.6549C6.17595 15.8079 6.43224 15.9239 6.68755 16.0428L6.65832 16.8643C6.64175 17.334 6.80936 17.7832 7.13192 18.1291C7.45349 18.4751 7.88909 18.6739 8.35879 18.6904L9.9618 18.7489C10.9343 18.783 11.7539 18.021 11.788 17.0484L11.8172 16.2162C12.3454 16.0174 12.856 15.7689 13.3228 15.4396L14.0108 15.8703C14.8352 16.3868 15.9266 16.1353 16.4431 15.3109L17.2938 13.9515C17.8103 13.1271 17.5598 12.0367 16.7344 11.5202Z"
        fill="#B4F5A3"
      />
    </g>
  </svg>
);

export const ControlsIcon = () => (
  <svg className="icon controls-icon" viewBox="0 0 15 13" fill="none">
    <g id="controls" transform="translate(-4.5,-5.5)">
      <g id="Group">
        <path id="Path 2" d="M 17,6 V 18" stroke="#b4f5a3" strokeLinecap="round" />
        <path id="Path 2_2" d="M 12,6 V 18" stroke="#b4f5a3" strokeLinecap="round" />
        <path id="Path 2_3" d="M 7,6 V 18" stroke="#b4f5a3" strokeLinecap="round" />
      </g>
      <path id="Path 2_4" d="M 5,8 H 9" stroke="#b4f5a3" strokeLinecap="round" />
      <path id="Path 2_5" d="m 10,16 h 4" stroke="#b4f5a3" strokeLinecap="round" />
      <path id="Path 2_6" d="m 15,12 h 4" stroke="#b4f5a3" strokeLinecap="round" />
    </g>
  </svg>
);

export const GlobeIcon = () => (
  <svg className="icon globe-icon" viewBox="0 0 16 16">
    <path
      className="fill-blue"
      d="M4.79999 5.86678V5.36678C4.52385 5.36678 4.29999 5.59064 4.29999 5.86678H4.79999ZM4.79999
        6.93345L5.15354 7.287L5.29999 7.14055V6.93345H4.79999ZM2.97908 7.24587L2.62552 7.59942H2.62552L2.97908
        7.24587ZM6.93332 13.8668H7.43332V13.6597L7.28688 13.5132L6.93332 13.8668ZM5.86666 12.8001H5.36666V13.0072L5.5131
        13.1537L5.86666 12.8001ZM5.86666 11.2001H6.36666V10.993L6.22021 10.8466L5.86666 11.2001ZM4.79999 10.1334H4.29999V10.3406L4.44644
        10.487L4.79999 10.1334ZM4.79999 9.06678V8.56678C4.52385 8.56678 4.29999 8.79064 4.29999 9.06678H4.79999ZM9.63332
        0.533447V2.66678H10.6333V0.533447H9.63332ZM9.06666 3.23345H7.99999V4.23345H9.06666V3.23345ZM5.86666
        5.36678H4.79999V6.36678H5.86666V5.36678ZM4.29999 5.86678V6.93345H5.29999V5.86678H4.29999ZM4.44644
        6.57989L4.13402 6.89231L4.84113 7.59942L5.15354 7.287L4.44644 6.57989ZM3.33263 6.89231L1.42021
        4.97989L0.713105 5.687L2.62552 7.59942L3.33263 6.89231ZM6.43332 4.80011C6.43332 5.11307 6.17962
        5.36678 5.86666 5.36678V6.36678C6.7319 6.36678 7.43332 5.66536 7.43332 4.80011H6.43332ZM7.99999
        3.23345C7.13475 3.23345 6.43332 3.93487 6.43332 4.80011H7.43332C7.43332 4.48715 7.68703 4.23345
        7.99999 4.23345V3.23345ZM4.13402 6.89231C3.91272 7.11361 3.55393 7.11361 3.33263 6.89231L2.62552
        7.59942C3.23735 8.21124 4.2293 8.21124 4.84113 7.59942L4.13402 6.89231ZM9.63332 2.66678C9.63332
        2.97974 9.37962 3.23345 9.06666 3.23345V4.23345C9.9319 4.23345 10.6333 3.53203 10.6333 2.66678H9.63332ZM7.43332
        15.4668V13.8668H6.43332V15.4668H7.43332ZM7.28688 13.5132L6.22021 12.4466L5.5131 13.1537L6.57977 14.2203L7.28688
        13.5132ZM6.36666 12.8001V11.2001H5.36666V12.8001H6.36666ZM6.22021 10.8466L5.15354 9.77989L4.44644 10.487L5.5131
        11.5537L6.22021 10.8466ZM5.29999 10.1334V9.06678H4.29999V10.1334H5.29999ZM4.79999 9.56678H9.06666V8.56678H4.79999V9.56678ZM9.63332
        10.1334V10.8446H10.6333V10.1334H9.63332ZM11.5555 12.7668H14.4V11.7668H11.5555V12.7668ZM10.7 11.9112C10.7 12.3837
        11.083 12.7668 11.5555 12.7668V11.7668C11.6353 11.7668 11.7 11.8314 11.7 11.9112H10.7ZM10.4889 11.7001C10.6055
        11.7001 10.7 11.7946 10.7 11.9112H11.7C11.7 11.2423 11.1578 10.7001 10.4889 10.7001V11.7001ZM9.63332 10.8446C9.63332
        11.3171 10.0164 11.7001 10.4889 11.7001V10.7001C10.5687 10.7001 10.6333 10.7648 10.6333 10.8446H9.63332ZM9.06666
        9.56678C9.37962 9.56678 9.63332 9.82049 9.63332 10.1334H10.6333C10.6333 9.2682 9.9319 8.56678 9.06666
        8.56678V9.56678ZM7.99999 14.9668C4.15241 14.9668 1.03333 11.8477 1.03333 8.00011H0.0333252C0.0333252
        12.4 3.60012 15.9668 7.99999 15.9668V14.9668ZM14.9667 8.00011C14.9667 11.8477 11.8476 14.9668
        7.99999 14.9668V15.9668C12.3999 15.9668 15.9667 12.4 15.9667 8.00011H14.9667ZM7.99999
        1.03345C11.8476 1.03345 14.9667 4.15253 14.9667 8.00011H15.9667C15.9667 3.60025 12.3999 0.0334473 7.99999
        0.0334473V1.03345ZM7.99999 0.0334473C3.60012 0.0334473 0.0333252 3.60025 0.0333252 8.00011H1.03333C1.03333
        4.15253 4.15241 1.03345 7.99999 1.03345V0.0334473Z"
    />
  </svg>
);

export const LogoIcon: React.FC<IconProps> = ({ size }) => (
  <img
    className={`icon logo-icon icon-size-${size}`}
    src={marketplaceLogo}
    color={'#4BE725'}
    alt="command"
  />
);

export const OpenMarketplaceLogo: React.FC<IconProps> = ({ size }) => (
  <svg
    className={`icon open-marketplace-icon icon-size-${size}`}
    width="24"
    height="24"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 4V28H25M14.2414 4V9.7931M5.96552 19.7241V23.8621M5.96552 10.6207V13.1034M22.5172 10.6207V14.7586M22.5172 21.3793V25.5172M4.31034 13.1034H7.62069V19.7241H4.31034V13.1034ZM12.5862 9.7931H15.8966V16.4138H12.5862V9.7931ZM20.8621 14.7586H24.1724V21.3793H20.8621V14.7586Z"
      stroke="#4BE725"
    />
  </svg>
);

export const CandlestickIcon = () => (
  <svg
    className="icon icon-size-24 candlestick-icon"
    width="20"
    preserveAspectRatio="none"
    height="20"
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line y1="9.9165" x2="18" y2="9.9165" stroke="white" strokeWidth="1.5" strokeDasharray="1 1" />
    <line
      x1="3.5"
      y1="0.5"
      x2="3.5"
      y2="15.5"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="9.5"
      y1="0.5"
      x2="9.5"
      y2="15.5"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="15.5"
      y1="0.5"
      x2="15.5"
      y2="15.5"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="2.5" y="3.5" width="2" height="3" fill="white" stroke="white" />
    <rect x="8.5" y="7.5" width="2" height="5" fill="white" stroke="white" />
    <rect x="14.5" y="4.30957" width="2" height="7.38095" fill="white" stroke="white" />
  </svg>
);

export const ExchangeIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg
    className={`icon exchange-icon icon-size-${size}`}
    width="16"
    height="20"
    viewBox="0 0 16 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className={color ? `fill-${color}` : ''}
      d="M15.5303 6.53033C15.8232 6.23744 15.8232 5.76256 15.5303 5.46967L10.7574 0.696699C10.4645 0.403806 9.98959 0.403806 9.6967 0.696699C9.40381 0.989593 9.40381 1.46447 9.6967 1.75736L13.9393 6L9.6967 10.2426C9.40381 10.5355 9.40381 11.0104 9.6967 11.3033C9.98959 11.5962 10.4645 11.5962 10.7574 11.3033L15.5303 6.53033ZM1 6.75H15V5.25H1V6.75Z"
      fill="#4E5E7E"
    />
    <path
      className={color ? `fill-${color}` : ''}
      d="M0.46967 14.5303C0.176777 14.2374 0.176777 13.7626 0.46967 13.4697L5.24264 8.6967C5.53553 8.40381 6.01041 8.40381 6.3033 8.6967C6.59619 8.98959 6.59619 9.46447 6.3033 9.75736L2.06066 14L6.3033 18.2426C6.59619 18.5355 6.59619 19.0104 6.3033 19.3033C6.01041 19.5962 5.53553 19.5962 5.24264 19.3033L0.46967 14.5303ZM15 14.75H1V13.25H15V14.75Z"
      fill="#4E5E7E"
    />
  </svg>
);

export const LockIcon = () => (
  <svg
    className="icon lock-icon"
    width="14"
    height="20"
    viewBox="0 0 14 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="6"
      width="12"
      height="10.6667"
      stroke="#131720"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.66602 6.33333C3.82475 4.55556 3.66602 1 6.99935 1C10.3327 1 10.174 4.55556 10.3327 6.33333"
      stroke="#131720"
    />
    <line
      x1="7"
      y1="10"
      x2="7"
      y2="12.6667"
      stroke="#131720"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const LogoutIcon = () => (
  <svg
    className="icon logout-icon"
    width="15"
    height="14"
    viewBox="0 0 15 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.941 6.50026L3.751 6.50026C3.337 6.50026 3.001 6.83626 3.001 7.25026C3.001 7.66426 3.337 8.00026 3.751 8.00026H11.941L9.221 10.7193C9.075 10.8663 9.001 11.0583 9.001 11.2503C9.001 11.4423 9.075 11.6343 9.221 11.7803C9.514 12.0733 9.989 12.0733 10.282 11.7803L14.282 7.78026C14.351 7.71126 14.406 7.62826 14.443 7.53626C14.519 7.35326 14.519 7.14626 14.443 6.96326C14.406 6.87126 14.351 6.78926 14.282 6.71926L10.282 2.71926C9.989 2.42626 9.514 2.42626 9.221 2.71926C8.928 3.01226 8.928 3.48726 9.221 3.78026L11.941 6.50026Z"
      fill="#174DE8"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.75098 12.5H1.50098L1.50098 2H6.75098V0.5L0.750977 0.5C0.336977 0.5 0.000976562 0.836 0.000976562 1.25L0.000976563 13.25C0.000976563 13.664 0.336977 14 0.750977 14H6.75098V12.5Z"
      fill="#174DE8"
    />
  </svg>
);

export const MarketIcon = () => (
  <svg
    className="icon market-icon"
    width="14"
    height="17"
    viewBox="0 0 14 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 4.36865L2.94737 6.05286L6.73684 4.36865L10.5263 6.05286L13.4737 4.36865V17.0002H0V4.36865Z"
      fill="#303132"
    />
    <path
      d="M2.10523 6.89474C1.96488 4.92982 2.6947 1 6.73681 1"
      stroke="#303132"
      strokeWidth="1.5"
    />
    <path
      d="M10.9314 6.89474C11.0717 4.92982 10.3419 1 6.29981 1"
      stroke="#303132"
      strokeWidth="1.5"
    />
  </svg>
);

export const OrdersIcon: React.FC<IconProps> = ({ size }) => (
  <svg
    className={`icon orders-icon icon-size-${size}`}
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0)">
      <path
        d="M10.8109 1.40002L10.8887 1.78891H12.0554L11.822 0.622244C11.7443 0.311133 11.4332 0.0777996 11.122 0.155577L1.71094 1.78891H8.55538L10.8109 1.40002Z"
        fill="#B4F5A3"
      />
      <path
        d="M13.2219 4.43338L13.1442 2.41116C13.1442 2.10005 12.9108 1.78894 12.5219 1.78894H12.0553H10.8886H8.55527H1.71083H0.777496C0.466385 1.78894 0.155273 2.02227 0.155273 2.41116V10.8889C0.155273 11.2001 0.388607 11.5112 0.777496 11.5112H12.5997C12.9108 11.5112 13.2219 11.2778 13.2219 10.8889V9.48894C13.5331 9.48894 13.8442 9.25561 13.8442 8.86672V4.97783C13.8442 4.66672 13.5331 4.43338 13.2219 4.43338ZM11.9775 10.3445H1.39972V2.95561H12.0553V4.43338H8.08861C7.62194 4.43338 7.38861 4.66672 7.38861 4.97783V8.9445C7.38861 9.25561 7.62194 9.56672 8.01083 9.56672H11.9775V10.3445ZM12.5997 8.32227H11.9775H8.55527V5.60005H11.9775H12.5997V8.32227Z"
        fill="#B4F5A3"
      />
      <path
        d="M10.5783 7.62213C10.9219 7.62213 11.2005 7.34355 11.2005 6.99991C11.2005 6.65626 10.9219 6.37769 10.5783 6.37769C10.2346 6.37769 9.95605 6.65626 9.95605 6.99991C9.95605 7.34355 10.2346 7.62213 10.5783 7.62213Z"
        fill="#B4F5A3"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="14" height="11.6667" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const PublicIcon: React.FC<IconProps> = ({ size }) => (
  <svg
    className={`icon public-icon icon-size-${size}`}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 8.83636C0 4.00909 3.92727 0 8.83636 0C13.6636 0 17.5909 4.00909 17.5909 8.83636C17.5909 13.6636 13.7455 17.6727 8.83636 17.6727C3.92727 17.6727 0 13.6636 0 8.83636ZM1.55455 6.62727C1.30909 7.28182 1.22727 8.1 1.22727 8.83636C1.22727 9.57273 1.39091 10.3909 1.55455 11.1273H5.31818V6.62727H1.55455ZM6.54545 6.62727H11.0455V11.1273H6.54545V6.62727ZM16.0364 6.62727H12.2727V11.0455H16.0364C16.2818 10.3909 16.3636 9.57273 16.3636 8.83636C16.3636 8.1 16.2818 7.36364 16.0364 6.62727ZM15.5455 5.4H12.2727V2.12727C13.6636 2.86364 14.8091 4.00909 15.5455 5.4ZM11.0455 5.4V1.63636C10.3091 1.39091 9.65455 1.30909 8.83636 1.30909C8.01818 1.30909 7.28182 1.39091 6.54545 1.63636V5.4H11.0455ZM5.31818 2.12727V5.4H2.04545C2.78182 4.00909 3.92727 2.86364 5.31818 2.12727ZM5.4 12.2727H2.12727C2.78182 13.6636 3.92727 14.8091 5.4 15.5455V12.2727ZM6.54545 16.0364V12.2727H11.0455V16.0364C10.3091 16.2818 9.57273 16.3636 8.83636 16.3636C8.1 16.3636 7.28182 16.2818 6.54545 16.0364ZM12.2727 12.2727V15.5455C13.6636 14.8091 14.8091 13.6636 15.5455 12.2727H12.2727Z"
      fill="#B4F5A3"
    />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size }) => (
  <svg
    className={`icon user-icon icon-size-${size}`}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="18"
      height="18"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0H17.9999V17.9997H0V0Z" fill="white" />
    </mask>
    <g mask="url(#mask0)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7325 14.4805C14.5144 13.1707 13.7531 10.7609 11.1685 9.87462C12.096 9.20121 12.7059 8.11591 12.7059 6.88238C12.7059 4.83568 11.0467 3.1765 9.00002 3.1765C6.95331 3.1765 5.29413 4.83568 5.29413 6.88238C5.29413 8.11591 5.90402 9.20121 6.83155 9.87462C4.24696 10.7609 3.4846 13.1697 3.26755 14.4805C1.90272 13.0532 1.05884 11.1251 1.05884 9.00003C1.05884 4.62074 4.62072 1.05885 9.00002 1.05885C13.3793 1.05885 16.9412 4.62074 16.9412 9.00003C16.9412 11.1251 16.0973 13.0532 14.7325 14.4805ZM6.35319 6.88239C6.35319 5.42227 7.54119 4.23533 9.00025 4.23533C10.4593 4.23533 11.6473 5.42227 11.6473 6.88239C11.6473 8.34145 10.4593 9.52945 9.00025 9.52945C7.54119 9.52945 6.35319 8.34145 6.35319 6.88239ZM4.23522 15.3381C4.23733 15.0523 4.3411 10.5883 8.99992 10.5883C13.6355 10.5883 13.7615 15.047 13.7636 15.3381C12.4358 16.3387 10.7883 16.9412 8.99992 16.9412C7.21051 16.9412 5.56404 16.3387 4.23522 15.3381ZM9 0C4.02988 0 0 4.02882 0 9C0 13.9701 4.02988 18 9 18C13.9701 18 18 13.9701 18 9C18 4.02882 13.9701 0 9 0Z"
        fill="#B4F5A3"
      />
    </g>
  </svg>
);

export const WalletIcon: React.FC<IconProps> = ({ size }) => (
  <svg
    className={`icon wallet-icon icon-size-${size}`}
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.8109 1.40002L10.8887 1.78891H12.0554L11.822 0.622244C11.7443 0.311133 11.4332 0.0777996 11.122 0.155577L1.71094 1.78891H8.55538L10.8109 1.40002Z"
      fill="#B4F5A3"
    />
    <path
      d="M13.2219 4.43338L13.1442 2.41116C13.1442 2.10005 12.9108 1.78894 12.5219 1.78894H12.0553H10.8886H8.55527H1.71083H0.777496C0.466385 1.78894 0.155273 2.02227 0.155273 2.41116V10.8889C0.155273 11.2001 0.388607 11.5112 0.777496 11.5112H12.5997C12.9108 11.5112 13.2219 11.2778 13.2219 10.8889V9.48894C13.5331 9.48894 13.8442 9.25561 13.8442 8.86672V4.97783C13.8442 4.66672 13.5331 4.43338 13.2219 4.43338ZM11.9775 10.3445H1.39972V2.95561H12.0553V4.43338H8.08861C7.62194 4.43338 7.38861 4.66672 7.38861 4.97783V8.9445C7.38861 9.25561 7.62194 9.56672 8.01083 9.56672H11.9775V10.3445ZM12.5997 8.32227H11.9775H8.55527V5.60005H11.9775H12.5997V8.32227Z"
      fill="#B4F5A3"
    />
  </svg>
);

export const CircleIcon = () => <div className="icon circle-icon"></div>;

export const IconClose = () => (
  <svg className="icon close" viewBox="0 0 14 14">
    <path
      className="fill-blue"
      d="M8.6,7.5L12.1,4c0.3-0.3,0.3-0.8,0-1.1S11.3,2.7,11,3L7.5,6.5L4,3C3.7,2.7,3.2,2.7,3,3S2.7,3.7,3,4l3.5,3.5
          L3,11c-0.3,0.3-0.3,0.8,0,1.1c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2l3.5-3.5l3.5,3.5c0.1,0.1,0.3,0.2,0.5,0.2s0.4-0.1,0.5-0.2
          c0.3-0.3,0.3-0.8,0-1.1L8.6,7.5z"
    />
  </svg>
);

export const IconChevronDown = () => (
  <svg className="icon chevron-down" viewBox="0 -6 16 16">
    <path
      className="fill-blue"
      d="M7,7L1,1h2l4.5,4.4L12,1h2.1l-6,6C7.9,7.1,7.7,7.2,7.5,7.2C7.3,7.2,7.1,7.1,7,7z"
    />
  </svg>
);

export const IconChevronUp = () => (
  <svg className="icon chevron-up" viewBox="0 3 16 16">
    <IconChevronDown />
  </svg>
);

export const AddPlusIcon = () => (
  <svg className="icon add-plus" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      className="fill-blue"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.7323 10.3071H11.3923V5.96706C11.3923 5.6676 11.1493 5.42456 10.8498 5.42456C10.5503 5.42456 10.3073 5.6676 10.3073 5.96706V10.3071H5.9673C5.66784 10.3071 5.4248 10.5501 5.4248 10.8496C5.4248 11.149 5.66784 11.3921 5.9673 11.3921H10.3073V15.7321C10.3073 16.0315 10.5503 16.2746 10.8498 16.2746C11.1493 16.2746 11.3923 16.0315 11.3923 15.7321V11.3921H15.7323C16.0318 11.3921 16.2748 11.149 16.2748 10.8496C16.2748 10.5501 16.0318 10.3071 15.7323 10.3071Z"
      fill="#1444CB"
    />
    <path
      className="fill-blue"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8492 20.4227C5.57021 20.4227 1.27563 16.1281 1.27563 10.8492C1.27563 5.57021 5.57021 1.27563 10.8492 1.27563C16.1281 1.27563 20.4227 5.57021 20.4227 10.8492C20.4227 16.1281 16.1281 20.4227 10.8492 20.4227ZM0 10.85C0 16.8323 4.86765 21.7 10.85 21.7C16.8323 21.7 21.7 16.8323 21.7 10.85C21.7 4.86765 16.8323 0 10.85 0C4.86765 0 0 4.86765 0 10.85Z"
      fill="#1444CB"
    />
  </svg>
);

export const OverflowIcon = () => (
  <svg className="icon overflow-icon" width="20px" viewBox="0 0 17.8 4.6">
    <circle className="fill-blue" cx="2" cy="2.3" r="2" />
    <circle className="fill-blue" cx="8.9" cy="2.3" r="2" />
    <circle className="fill-blue" cx="15.8" cy="2.3" r="2" />
  </svg>
);

export const EditIcon = () => (
  <svg className="icon edit-icon fill-blue" viewBox="0 0 15 15">
    <polygon className="fill-blue" points="11.1,7.1 8.9,4.9 3.4,10.4 5.6,12.6 " />
    <polygon className="fill-blue" points="3,10.8 3,13 5.2,13 " />
    <path
      className="fill-blue"
      d="M12.8,5.4c0.2-0.2,0.2-0.6,0-0.8l-1.4-1.4c-0.2-0.2-0.6-0.2-0.8,0L9.5,4.3l2.2,2.2L12.8,5.4z"
    />
    <g>
      <path
        className="fill-blue"
        d="M13.5,15.1h-10c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h10c0.3,0,0.5,0.2,0.5,0.5S13.8,15.1,13.5,15.1z"
      />
    </g>
  </svg>
);

export const IconCircledCheck = () => (
  <svg className="icon circled-check-icon fill-green" viewBox="0 0 14 14">
    <circle cx="7" cy="7" r="6.5" fill="white" stroke="#4BE725" />
    <path
      className="fill-green"
      d="M6.16873 10.4437C6.00449 10.4437 5.8465 10.3839 5.72243 10.2741L3 7.84354L3.89171 6.84472L6.10893 8.82361L10.2997 4L11.311 4.87921L6.67394 10.2134C6.55701 10.3491 6.3901 10.4303 6.21068 10.4419C6.19729 10.4428 6.18301 10.4437 6.16873 10.4437Z"
      fill="#3A62CA"
    />
  </svg>
);
