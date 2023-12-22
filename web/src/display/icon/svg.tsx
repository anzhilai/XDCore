import React from "react";
import styled from "styled-components";

function formatProps(props) {
  if (props) {
    let _props = {...props};
    if (_props.width == undefined) {
      delete _props.width;
    }
    if (_props.height == undefined) {
      delete _props.height;
    }
    props = _props;
  }
  return props;
}

const Spin = styled.div`
    svg {
        animation: spin 1.2s linear infinite ;
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    }
`

const SvgMap = {
  Paperclip: (props) =>
    (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paperclip"
          viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
    </svg>),
  Folder: (props) =>
    (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-folder"
          viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
    </svg>),
  ArrowDown: (props) =>
    (<svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M494.094 733.426a41.472 41.472 0 01-20.023-11.126L140.16 388.388c-16.272-16.271-16.272-42.653 0-58.925 16.271-16.272 42.653-16.272 58.925 0L503.66 634.037 808.186 329.51c16.271-16.272 42.653-16.272 58.925 0s16.272 42.654 0 58.926L533.2 722.347c-10.607 10.607-25.508 14.3-39.106 11.08z"
        fillRule="evenodd"
      />
    </svg>),
  ArrowLeft: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M296.114 508.035c-3.22-13.597.473-28.499 11.079-39.105l333.912-333.912c16.271-16.272 42.653-16.272 58.925 0s16.272 42.654 0 58.926L395.504 498.47l304.574 304.574c16.272 16.272 16.272 42.654 0 58.926s-42.654 16.272-58.926 0L307.241 528.058a41.472 41.472 0 01-11.127-20.023z"
        fillRule="evenodd"
      />
    </svg>
  ),
  ArrowRight: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M711.156 508.035a41.472 41.472 0 01-11.126 20.023L366.12 861.97c-16.272 16.272-42.654 16.272-58.926 0s-16.272-42.654 0-58.926L611.767 498.47 307.241 193.944c-16.272-16.272-16.272-42.654 0-58.926 16.271-16.272 42.653-16.272 58.925 0L700.078 468.93c10.606 10.606 14.299 25.508 11.078 39.105z"
        fillRule="evenodd"
      />
    </svg>
  ),
  ArrowUp: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)} >
      <path
        d="M513.176 285.05a41.472 41.472 0 0120.024 11.127L867.11 630.089c16.272 16.271 16.272 42.653 0 58.925s-42.654 16.272-58.925 0L503.612 384.44 199.085 688.967c-16.272 16.271-42.654 16.271-58.925 0-16.272-16.272-16.272-42.654 0-58.926L474.07 296.129c10.606-10.606 25.508-14.299 39.105-11.078z"
        fillRule="evenodd"
      />
    </svg>
  ),
  Close: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}  >
      <path
        d="M560.149 501.223l255.344 255.344c16.272 16.272 16.272 42.654 0 58.926s-42.654 16.272-58.926 0L501.223 560.149 245.88 815.493c-16.272 16.272-42.654 16.272-58.925 0-16.272-16.272-16.272-42.654 0-58.926l255.344-255.344L186.954 245.88c-16.272-16.272-16.272-42.654 0-58.925 16.271-16.272 42.653-16.272 58.925 0l255.344 255.344 255.344-255.344c16.272-16.272 42.654-16.272 58.926 0 16.272 16.271 16.272 42.653 0 58.925L560.149 501.223z"
        fillRule="nonzero"
      />
    </svg>
  ),
  CloseCircle: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <g fillRule="evenodd">
        <g>
          <path
            d="M500 460.716l137.493-137.493c10.848-10.848 28.436-10.848 39.284 0l.101.102c10.735 10.848 10.645 28.344-.203 39.08l-138.207 136.78 138.309 138.308c10.848 10.848 10.848 28.436 0 39.284-10.848 10.848-28.436 10.848-39.284 0L498.98 538.264 359.85 675.956c-10.41 10.303-27.188 10.26-37.545-.097-10.34-10.341-10.34-27.107 0-37.448L460.716 500 323.223 362.507c-10.848-10.848-10.848-28.436 0-39.284 10.848-10.848 28.436-10.848 39.284 0L500 460.716z"/>
          <path
            d="M190.64 809.36c170.855 170.854 447.865 170.854 618.72 0 170.854-170.855 170.854-447.865 0-618.72-170.855-170.854-447.865-170.854-618.72 0-170.854 170.855-170.854 447.865 0 618.72zm-44.193 44.193c-195.263-195.262-195.263-511.844 0-707.106 195.262-195.263 511.844-195.263 707.106 0 195.263 195.262 195.263 511.844 0 707.106-195.262 195.263-511.844 195.263-707.106 0z"
            fillRule="nonzero"
          />
        </g>
      </g>
    </svg>
  ),
  CloseCircleFill: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)} >
      <path
        d="M500 0C224.32 0 0 224.286 0 500s224.286 500 500 500c275.68 0 500-224.286 500-500S775.714 0 500 0zm203.965 654c13.928 14 13.892 36.572-.072 50.5a35.644 35.644 0 01-25.213 10.429c-9.179 0-18.321-3.5-25.287-10.5L499.821 550.393l-154.07 152.43c-6.964 6.857-16.037 10.32-25.109 10.32-9.213 0-18.392-3.536-25.392-10.607-13.857-14.036-13.75-36.608.286-50.5L449.43 499.821 296.107 346c-13.93-13.965-13.893-36.572.07-50.5 13.966-13.965 36.536-13.892 50.5.07l153.536 154 154.071-152.427c14-13.892 36.643-13.75 50.5.286 13.892 14.036 13.75 36.643-.286 50.5l-153.89 152.213L703.965 654z"
        fillRule="nonzero"
      />
    </svg>
  ),
  DeleteKey: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M606.557 535.541l129.246 129.246 35.956-35.956-129.246-129.246L771.76 370.34l-35.956-35.956-129.246 129.246-129.246-129.246-35.956 35.956L570.6 499.585 441.355 628.831l35.956 35.956 129.246-129.246zm217.006-341.967c61.114 0 110.863 49.027 110.863 109.29v393.443c0 60.262-49.727 109.29-110.863 109.29H409.836a112.175 112.175 0 01-79.979-33.618L72.852 515.673l-.416-.438-.415-.415a21.094 21.094 0 01-6.426-15.257c0-4.044 1.115-9.989 6.426-15.257l.415-.415.416-.437L329.857 227.17a112.131 112.131 0 0179.979-33.64h413.727v.044zm0-65.574H427.519a177.18 177.18 0 00-126.973 53.465L25.857 437.77a86.842 86.842 0 000 123.65l274.689 256.306a177.18 177.18 0 00126.973 53.465h396.044c97.442 0 176.437-78.295 176.437-174.864V302.885C1000 206.295 921.005 128 823.563 128z"
        fillRule="nonzero"
      />
    </svg>
  ),
  Empty: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}/>
  ),
  Keyboard: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M0 138h1000v600.537H0V138zm61.538 61.594v477.35h876.924v-477.35H61.538zm92.308 76.991h76.923v76.992h-76.923v-76.992zm123.077 0h76.923v76.992h-76.923v-76.992zm123.077 0h76.923v76.992H400v-76.992zm123.077 0H600v76.992h-76.923v-76.992zm123.077 0h76.923v76.992h-76.923v-76.992zm123.077 0h76.923v76.992H769.23v-76.992zM215.385 399.772h76.923v76.992h-76.923v-76.992zm123.077 0h76.923v76.992h-76.923v-76.992zm123.076 0h76.924v76.992h-76.924v-76.992zm123.077 0h76.923v76.992h-76.923v-76.992zm123.077 0h76.923v76.992h-76.923v-76.992zM153.846 522.96h76.923v76.992h-76.923V522.96zm615.385 0h76.923v76.992H769.23V522.96zm-492.308 0h446.154v76.992H276.923V522.96zm138.462 246.374H600l-92.308 92.39-92.307-92.39z"
        fillRule="nonzero"
      />
    </svg>
  ),
  Minus: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M537.5 537.5h-400c-20.71 0-37.5-16.79-37.5-37.5s16.79-37.5 37.5-37.5h725c20.71 0 37.5 16.79 37.5 37.5s-16.79 37.5-37.5 37.5h-325z"
        fillRule="nonzero"
      />
    </svg>
  ),
  Plus: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M537.5 537.5v325c0 20.71-16.79 37.5-37.5 37.5s-37.5-16.79-37.5-37.5v-325h-325c-20.71 0-37.5-16.79-37.5-37.5s16.79-37.5 37.5-37.5h325v-325c0-20.71 16.79-37.5 37.5-37.5s37.5 16.79 37.5 37.5v325h325c20.71 0 37.5 16.79 37.5 37.5s-16.79 37.5-37.5 37.5h-325z"
        fillRule="nonzero"
      />
    </svg>
  ),
  PlusCircle: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)} >
      <g fillRule="evenodd">
        <path
          d="M472.222 472.222V277.778C472.222 262.437 484.66 250 500 250h.143c15.262.08 27.57 12.516 27.49 27.777l-1.009 194.445h195.598C737.563 472.222 750 484.66 750 500s-12.437 27.778-27.778 27.778H526.336l-1.017 195.743C525.243 738.167 513.35 750 498.702 750c-14.624 0-26.48-11.855-26.48-26.48V527.778H277.778C262.437 527.778 250 515.34 250 500s12.437-27.778 27.778-27.778h194.444z"/>
        <path
          d="M500 937.5c241.625 0 437.5-195.875 437.5-437.5S741.625 62.5 500 62.5 62.5 258.375 62.5 500 258.375 937.5 500 937.5zm0 62.5C223.858 1000 0 776.142 0 500S223.858 0 500 0s500 223.858 500 500-223.858 500-500 500z"
          fillRule="nonzero"
        />
      </g>
    </svg>
  ),
  Search: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M987.88 936.17l.011-.01-226.8-226.8c56.11-72.027 89.545-162.583 89.545-260.959 0-234.73-190.287-425.018-425.018-425.018C190.888 23.383.603 213.67.603 448.401.603 683.132 190.89 873.42 425.62 873.42c109.721 0 209.728-41.585 285.133-109.847l224.864 224.864.032-.032c6.723 6.952 16.127 11.292 26.558 11.292 20.417 0 36.965-16.548 36.965-36.965a36.852 36.852 0 00-11.294-26.56zM424.255 796.948c-192.937 0-349.34-156.406-349.34-349.34 0-192.933 156.403-349.338 349.34-349.338 192.933 0 349.341 156.405 349.341 349.339 0 192.933-156.408 349.339-349.341 349.339z"
        fillRule="nonzero"
      />
    </svg>
  ),
  Success: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M119.415 524.046c-9.708-9.693-11.278-24.766-2.72-35.554l20.007-25.223c8.201-10.34 23.543-12.936 34.386-5.699l173.175 115.585c9.134 6.097 24.856 5.303 33.384-1.616l457.6-371.25c10.286-8.345 26.397-7.634 35.412 1.368l11.272 11.255c9.81 9.795 9.096 25.343-1.187 35.611l-491.14 490.414c-15.28 15.258-40.369 14.59-56.099-1.116l-214.09-213.775z"
        fillRule="nonzero"
      />
    </svg>
  ),
  SuccessCircle: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)} >
      <g fillRule="nonzero">
        <path
          d="M768.316 310.056l8.152 7.889c7.094 6.866 6.578 17.765-.859 24.962L420.41 686.668c-11.05 10.695-29.195 10.227-40.571-.782L225.005 536.038c-7.02-6.795-8.156-17.36-1.967-24.922l14.47-17.68c5.931-7.248 17.026-9.068 24.868-3.995l125.242 81.02c6.607 4.275 17.977 3.718 24.145-1.132l330.943-260.233c7.438-5.849 19.09-5.35 25.61.96z"/>
        <path
          d="M500 937.5c241.625 0 437.5-195.875 437.5-437.5S741.625 62.5 500 62.5 62.5 258.375 62.5 500 258.375 937.5 500 937.5zm0 62.5C223.858 1000 0 776.142 0 500S223.858 0 500 0s500 223.858 500 500-223.858 500-500 500z"/>
      </g>
    </svg>
  ),
  Volume: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)} >
      <path
        d="M810.15 874.348c-8.687 0-17.376-3.026-24.37-9.105a36.447 36.447 0 01-3.47-51.714c74.253-83.94 142.954-179.956 142.954-313.862 0-133.877-68.701-229.949-142.955-313.806a36.474 36.474 0 013.47-51.77c15.39-13.329 38.631-11.833 52.186 3.36 79.804 90.158 161.33 203.661 161.33 362.244 0 158.555-81.609 272.086-161.303 362.161a37.196 37.196 0 01-27.841 12.492zM684.24 749.852c-7.467 0-15.045-2.22-21.568-6.884a36.502 36.502 0 01-8.495-51.214l14.685-19.875c38.306-51.436 71.366-95.904 71.366-172.24 0-79.11-29.313-117.472-66.453-166.049-6.579-8.577-13.102-17.21-19.597-26.093a36.474 36.474 0 018.494-51.214c16.617-11.853 39.683-8.1 51.685 8.411 6.052 8.41 12.297 16.6 18.46 24.65 40.027 52.435 81.387 106.646 81.387 210.323 0 100.43-45.524 161.692-85.773 215.793l-14.101 19.153c-7.218 9.993-18.57 15.239-30.09 15.239zM111.033 317.657c-20.314-.047-36.85 16.327-37.002 36.64v290.685c0 20.235 16.627 36.668 37.002 36.668h111.033c9.798 0 19.236 3.858 26.148 10.743l222.12 184.73c3.943 3.886 7.496 7.106 10.799 9.827V112.385a174.46 174.46 0 00-10.854 9.882L248.214 306.859c-6.94 6.94-16.35 10.77-26.148 10.77H111.033v.028zm386.783 654.122c-24.233 0-48.744-16.683-79.75-42.776L206.743 754.987h-95.71C49.826 754.96 0 705.633 0 644.954V354.298c0-60.652 49.826-110.006 111.033-110.006h95.71L417.955 70.415C449.072 43.933 473.166 28 497.621 28c26.537 0 57.543 17.932 57.543 68.34v806.654c0 50.77-30.895 68.785-57.348 68.785z"
        fillRule="nonzero"
      />
    </svg>
  ),
  Warning: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <path
        d="M444.455 125.97c-.183-8.206 5.676-14.859 14.278-14.859h82.534c8.069 0 14.47 6.24 14.278 14.86l-11.753 525.836c-.183 8.207-7.153 14.86-14.685 14.86h-58.214c-7.927 0-14.492-6.24-14.685-14.86L444.455 125.97zM500 833.334c-30.682 0-55.556-24.873-55.556-55.555 0-30.683 24.874-55.556 55.556-55.556s55.556 24.873 55.556 55.556c0 30.682-24.874 55.555-55.556 55.555z"
        fillRule="evenodd"
      />
    </svg>
  ),
  WarningCircle: (props) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1000 1000"
      fill="currentColor"
      focusable={false}
      aria-hidden="true"
      {...formatProps(props)}>
      <g fillRule="evenodd">
        <g>
          <path
            d="M499.938 937.383c241.594 0 437.445-195.851 437.445-437.445 0-241.595-195.851-437.446-437.445-437.446-241.595 0-437.446 195.851-437.446 437.446 0 241.594 195.851 437.445 437.446 437.445zm0 62.492C223.83 999.875 0 776.045 0 499.938 0 223.83 223.83 0 499.938 0c276.107 0 499.937 223.83 499.937 499.938 0 276.107-223.83 499.937-499.937 499.937z"
            fillRule="nonzero"
          />
          <path
            d="M459.326 227.299c-.144-6.462 4.47-11.701 11.242-11.701h64.988c6.353 0 11.394 4.913 11.242 11.7l-9.254 414.045c-.144 6.462-5.632 11.7-11.563 11.7h-45.838c-6.241 0-11.411-4.912-11.563-11.7l-9.254-414.044zm43.736 556.978c-24.16 0-43.744-19.585-43.744-43.745 0-24.159 19.585-43.744 43.744-43.744 24.16 0 43.745 19.585 43.745 43.744 0 24.16-19.585 43.745-43.745 43.745z"/>
        </g>
      </g>
    </svg>
  ),
  Computer: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-laptop"
         focusable={false}
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5h11zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2h-11zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5z"/>
    </svg>
  ),
  CloseOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  ),
  Add: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-plus-square" viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      <path
        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
  ),
  Upload: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
      <path
        d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
    </svg>
  ),
  ExclamationCircleOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-exclamation-circle"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path
        d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
    </svg>
  ),
  QuestionCircleOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-question-circle" viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path
        d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
    </svg>
  ),
  Contacts: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-calendar2-minus" viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M5.5 10.5A.5.5 0 0 1 6 10h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
      <path
        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
      <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
    </svg>
  ),
  CloseCircleOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path
        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  ),
  ArrowLeftOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-arrow-left" viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
    </svg>
  ),
  ArrowRightOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-arrow-right" viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
    </svg>
  ),
  LoadingOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-arrow-clockwise"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
    </svg>
  ),
  PlusOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd"
            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
    </svg>
  ),
  TagOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tag"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"/>
      <path
        d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"/>
    </svg>
  ),
  AudioOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
      <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
    </svg>
  ),
  DownOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-chevron-down"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  ),
  BarsOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list-ul"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd"
            d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
  ),
  DownloadOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
      <path
        d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
    </svg>
  ),
  FilterOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"/>
    </svg>
  ),
  FullscreenOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-arrows-fullscreen" viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd"
            d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>
    </svg>
  ),
  ReloadOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-arrow-clockwise" viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
    </svg>
  ),
  MinusOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
    </svg>
  ),
  PlusCircleOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-plus-circle"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path
        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
  ),
  PlusSquareOutlined: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-plus-square"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      <path
        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
  ),
  Copy: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" fill="currentColor"
         width="16px" height="16px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" {...formatProps(props)}>
      <g>
        <g>
          <path d="M75.272,7.482h-0.005v-4.02c0-0.956-0.774-1.73-1.73-1.73h-2.45v0H42.397v0h-1.73l-25.95,25.95v2.447v1.013v52.912v2.447
                    c0,0.956,0.774,1.73,1.73,1.73h1.582h53.925h1.582c0.956,0,1.73-0.774,1.73-1.73v-2.448h0.005L75.272,7.482z M24.674,78.276
                    V31.142h17.723c0.956,0,1.73-0.774,1.73-1.73V11.689h21.188l0,66.587H24.674z"/>
        </g>
        <path d="M83.77,24.857h-3.475v66.911c0,0.835-0.677,1.513-1.513,1.513H29.306v3.475c0,0.836,0.677,1.513,1.513,1.513l0.001,0v0
                h52.95c0.836,0,1.513-0.677,1.513-1.513V26.37C85.283,25.534,84.606,24.857,83.77,24.857z"/>
      </g>
    </svg>
  ),
  CodePen: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
         fill="currentColor" {...formatProps(props)}>
      <path
        d="M21.838 8.445c0-.001-.001-.001 0 0l-.003-.004-.001-.001v-.001a.809.809 0 0 0-.235-.228l-9.164-6.08a.834.834 0 0 0-.898 0L2.371 8.214A.786.786 0 0 0 2 8.897v6.16a.789.789 0 0 0 .131.448v.001l.002.002.01.015v.002h.001l.001.001.001.001c.063.088.14.16.226.215l9.165 6.082a.787.787 0 0 0 .448.139.784.784 0 0 0 .45-.139l9.165-6.082a.794.794 0 0 0 .371-.685v-6.16a.793.793 0 0 0-.133-.452zm-9.057-4.172 6.953 4.613-3.183 2.112-3.771-2.536V4.273zm-1.592 0v4.189l-3.771 2.536-3.181-2.111 6.952-4.614zm-7.595 6.098 2.395 1.59-2.395 1.611v-3.201zm7.595 9.311-6.96-4.617 3.195-2.15 3.765 2.498v4.269zm.795-5.653-3.128-2.078 3.128-2.105 3.131 2.105-3.131 2.078zm.797 5.653v-4.27l3.766-2.498 3.193 2.15-6.959 4.618zm7.597-6.11-2.396-1.611 2.396-1.59v3.201z"></path>
    </svg>
  ),
  Reload: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-arrow-clockwise" viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
      <path
        d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
    </svg>
  ),
  Book: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-journal-bookmark" viewBox="0 0 16 16" {...formatProps(props)}>
      <path fillRule="evenodd"
            d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"/>
      <path
        d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
      <path
        d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
    </svg>
  ),
  Copyright: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="currentColor"
         viewBox="0 0 1024 1024" {...formatProps(props)}>
      <path
        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm5.6-532.7c53 0 89 33.8 93 83.4.3 4.2 3.8 7.4 8 7.4h56.7c2.6 0 4.7-2.1 4.7-4.7 0-86.7-68.4-147.4-162.7-147.4C407.4 290 344 364.2 344 486.8v52.3C344 660.8 407.4 734 517.3 734c94 0 162.7-58.8 162.7-141.4 0-2.6-2.1-4.7-4.7-4.7h-56.8c-4.2 0-7.6 3.2-8 7.3-4.2 46.1-40.1 77.8-93 77.8-65.3 0-102.1-47.9-102.1-133.6v-52.6c.1-87 37-135.5 102.2-135.5z"/>
    </svg>
  ),
  Warn: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         className="bi bi-exclamation-circle"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
      <path
        d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path>
    </svg>
  ),
  Home: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
    </svg>
  ),
  Dashboard: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-speedometer2"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"/>
      <path fill-rule="evenodd"
            d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"/>
    </svg>
  ),
  Person: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
    </svg>
  ),
  Columns: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-columns-gap"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M6 1v3H1V1h5zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm14 12v3h-5v-3h5zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5zM6 8v7H1V8h5zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H1zm14-6v7h-5V1h5zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-5z"/>
    </svg>
  ),
  PieChart: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pie-chart"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M7.5 1.018a7 7 0 0 0-4.79 11.566L7.5 7.793V1.018zm1 0V7.5h6.482A7.001 7.001 0 0 0 8.5 1.018zM14.982 8.5H8.207l-4.79 4.79A7 7 0 0 0 14.982 8.5zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
    </svg>
  ),
  Window: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-window"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
      <path
        d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm13 2v2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zM2 14a1 1 0 0 1-1-1V6h14v7a1 1 0 0 1-1 1H2z"/>
    </svg>
  ),
  Setting: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
      <path
        d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
    </svg>
  ),
  More: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
    </svg>
  ),
  Message: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      <path
        d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
    </svg>
  ),
  Check: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
    </svg>
  ),
  LogIn: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path d="m10.998 16 5-4-5-4v3h-9v2h9z"></path>
      <path
        d="M12.999 2.999a8.938 8.938 0 0 0-6.364 2.637L8.049 7.05c1.322-1.322 3.08-2.051 4.95-2.051s3.628.729 4.95 2.051S20 10.13 20 12s-.729 3.628-2.051 4.95-3.08 2.051-4.95 2.051-3.628-.729-4.95-2.051l-1.414 1.414c1.699 1.7 3.959 2.637 6.364 2.637s4.665-.937 6.364-2.637C21.063 16.665 22 14.405 22 12s-.937-4.665-2.637-6.364a8.938 8.938 0 0 0-6.364-2.637z"></path>
    </svg>
  ),
  LogOut: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path d="m2 12 5 4v-3h9v-2H7V8z"></path>
      <path
        d="M13.001 2.999a8.938 8.938 0 0 0-6.364 2.637L8.051 7.05c1.322-1.322 3.08-2.051 4.95-2.051s3.628.729 4.95 2.051 2.051 3.08 2.051 4.95-.729 3.628-2.051 4.95-3.08 2.051-4.95 2.051-3.628-.729-4.95-2.051l-1.414 1.414c1.699 1.7 3.959 2.637 6.364 2.637s4.665-.937 6.364-2.637c1.7-1.699 2.637-3.959 2.637-6.364s-.937-4.665-2.637-6.364a8.938 8.938 0 0 0-6.364-2.637z"></path>
    </svg>
  ),
  Question: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path
        d="M12 4C9.243 4 7 6.243 7 9h2c0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.069-.454 1.465-1.481 2.255-.382.294-.813.626-1.226 1.038C10.981 13.604 10.995 14.897 11 15v2h2v-2.009c0-.024.023-.601.707-1.284.32-.32.682-.598 1.031-.867C15.798 12.024 17 11.1 17 9c0-2.757-2.243-5-5-5zm-1 14h2v2h-2z"></path>
    </svg>
  ),
  Group: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path
        d="M16.604 11.048a5.67 5.67 0 0 0 .751-3.44c-.179-1.784-1.175-3.361-2.803-4.44l-1.105 1.666c1.119.742 1.8 1.799 1.918 2.974a3.693 3.693 0 0 1-1.072 2.986l-1.192 1.192 1.618.475C18.951 13.701 19 17.957 19 18h2c0-1.789-.956-5.285-4.396-6.952z"></path>
      <path
        d="M9.5 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm1.5 7H8c-3.309 0-6 2.691-6 6v1h2v-1c0-2.206 1.794-4 4-4h3c2.206 0 4 1.794 4 4v1h2v-1c0-3.309-2.691-6-6-6z"></path>
    </svg>
  ),
  Time: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path
        d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
      <path d="M13 7h-2v6h6v-2h-4z"></path>
    </svg>
  ),
  Timer: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path
        d="m20.145 8.27 1.563-1.563-1.414-1.414L18.586 7c-1.05-.63-2.274-1-3.586-1-3.859 0-7 3.14-7 7s3.141 7 7 7 7-3.14 7-7a6.966 6.966 0 0 0-1.855-4.73zM15 18c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
      <path d="M14 10h2v4h-2zm-1-7h4v2h-4zM3 8h4v2H3zm0 8h4v2H3zm-1-4h3.99v2H2z"></path>
    </svg>
  ),
  WinkSmile: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path
        d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
      <path
        d="M14.828 14.828a3.988 3.988 0 0 1-2.02 1.09 4.108 4.108 0 0 1-1.616 0 4.103 4.103 0 0 1-.749-.232 4.161 4.161 0 0 1-.679-.368 4.115 4.115 0 0 1-1.082-1.082l-1.658 1.117c.215.319.462.619.733.889a5.991 5.991 0 0 0 8.485.002c.272-.271.52-.571.734-.891l-1.658-1.117c-.143.211-.307.41-.49.592z"></path>
      <circle cx="8.5" cy="10.5" r="1.5"></circle>
      <path d="M15.5 10c-2 0-2.5 2-2.5 2h5s-.501-2-2.5-2z"></path>
    </svg>
  ),
  Loading: (props) => (
    <Spin>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="16" height="16"
           fill="currentColor" {...formatProps(props)}>
        <path
          d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3 0.1 19.9-16 36-35.9 36z"
          p-id="7623"></path>
      </svg>
    </Spin>
  ),
  Yen: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path d="M17.2 3.4 12 10.333 6.8 3.4 5.2 4.6 10 11H7v2h4v2H7v2h4v4h2v-4h4v-2h-4v-2h4v-2h-3l4.8-6.4z"></path>
    </svg>
  ),
  Grid: ({props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path
        d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
    </svg>
  ),
  List: ({props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path d="M4 6h2v2H4zm0 5h2v2H4zm0 5h2v2H4zm16-8V6H8.023v2H18.8zM8 11h12v2H8zm0 5h12v2H8z"></path>
    </svg>
  ),
  Bot: ({props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
         viewBox="0 0 24 24" {...formatProps(props)}>
      <path
        d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z"></path>
      <ellipse cx="8.5" cy="12" rx="1.5" ry="2"></ellipse>
      <ellipse cx="15.5" cy="12" rx="1.5" ry="2"></ellipse>
      <path d="M8 16h8v2H8z"></path>
    </svg>
  ),
  Email: ({props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
    </svg>
  ),
  Phone: ({props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path
        d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
      <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
    </svg>
  ),
  Info: ({props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle"
         viewBox="0 0 16 16" {...formatProps(props)}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
      <path
        d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
    </svg>
  )
};

export default SvgMap;



