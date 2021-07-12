import React, {useEffect, useState} from 'react';
import TizenPage from './TizenPage';
import './MainPage.css';

import 'swiper/swiper-bundle.min.css';
import SwiperCore, {A11y, Navigation, Pagination, Scrollbar, Virtual} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import ChatPlaceholder from './ChatList/ChatPlaceholder';
import ChatItem from './ChatList/ChatItem';
import TdLibController from '../Stores/TdLibController';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Virtual]);

export default function MainPage() {
  const [swiper, setSwiper] = useState(null);
  useEffect(() => {
    if (swiper) {
      swiper.updateAutoHeight(100);
      swiper.slideTo(1);
    }
  }, [swiper]);

  return (
      <TizenPage className="ui-scroll-on">
        <div className="ui-content">
          <Swiper
              spaceBetween={30}
              speed={100}
              autoHeight={true}
              centeredSlides={true}
              centeredSlidesBounds={true}
              virtual
              pagination={{
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3,
                renderBullet: (index, className) => {
                  if (index === 0) {
                    return `<img class="menu-bullet ${className}" src="${process.env.PUBLIC_URL +
                    '/icons/menu_white_18dp.svg'}" alt="Hamburger menu"/>`;
                  }
                  return `<span class="${className}"></span>`;
                },
              }}
              scrollbar={{draggable: true}}
              onSwiper={setSwiper}
              onSlideChange={() => console.log('slide change')}
          >
            <SwiperSlide key={0} virtualIndex={0}>
              <div className="slide-header">Settings</div>
              <ul className="ui-listview">
                <li><a href="#" onClick={() => TdLibController.logOut()}>Logout</a></li>
              </ul>
            </SwiperSlide>
            {Array.from({length: 100}, (el, index) =>
                <SwiperSlide key={index + 1} virtualIndex={index + 1}>
                  {/* 1 is added to virtualIndex because zero index is assigned to Settings slide */}
                  <div className="slide-header unread-header-badge">All chats</div>
                  <ul>
                    <ChatPlaceholder index={index + 1}/>
                    <ChatPlaceholder index={index + 1}/>
                    <ChatItem/>
                    <ChatItem/>
                    <ChatItem/>
                  </ul>
                </SwiperSlide>,
            )}
          </Swiper>
        </div>
      </TizenPage>
  );
}