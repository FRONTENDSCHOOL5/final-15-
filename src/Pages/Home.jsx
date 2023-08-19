import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../Styles/Layout';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useInView } from 'react-intersection-observer';
import userToken from '../Recoil/userToken/userToken';
import { isKorea } from '../Recoil/whichCountry/whichCountry';
import MainHeader from '../Components/common/Header/MainHeader';
import Toggle from '../Components/common/Toggle';
import HomePost from '../Components/HomePost/HomePostLayout';
import TopButton from '../Components/common/Topbutton';
import Navbar from '../Components/common/Navbar';
import URL from '../Utils/URL';
import HomePostSkeleton from '../Components/common/Skeleton/HomePostSkeleton';
import Spinner from '../Components/common/Spinner';
import Empty from '../Components/common/Empty';
import logo from '../Assets/logo-gray.png';
import isDesktop from '../Recoil/isDesktop/isDesktop';
import MyPillowings from '../Components/Home/MyPillowings';

const Home = () => {
  const isPCScreen = useRecoilValue(isDesktop);
  const token = useRecoilValue(userToken);
  const queryClient = useQueryClient();

  const feedCount = useRef(0);
  const [globalPosts, setGlobalPosts] = useState([]);
  const [koreaPosts, setKoreaPosts] = useState([]);
  const [isLeftToggle, setIsLeftToggle] = useRecoilState(isKorea);
  const [ref, inView] = useInView();

  const setCategory = (cachedData, followedFeed) => {
    const updatedKoreaPosts = [];
    const updatedGlobalPosts = [];

    if (cachedData) {
      feedCount.current += 1;
      for (let i = 0; i < cachedData.pages.length; i++) {
        cachedData?.pages[i]?.forEach((post) => {
          const match = post.content.match(/^\[(K|G)\]/);
          if (match === null || match[1] !== 'G') {
            updatedKoreaPosts.push(post);
          } else {
            updatedGlobalPosts.push(post);
          }
        });
      }
    } else {
      followedFeed?.pages[feedCount.current]?.forEach((post) => {
        const match = post.content.match(/^\[(K|G)\]/);
        if (match === null || match[1] !== 'G') {
          updatedKoreaPosts.push(post);
        } else {
          updatedGlobalPosts.push(post);
        }
      });
    }

    setKoreaPosts((prev) => [...prev, ...updatedKoreaPosts]);
    setGlobalPosts((prev) => [...prev, ...updatedGlobalPosts]);
  };

  const fetchFollowedFeed = async ({ pageParam }) => {
    const response = await fetch(`${URL}/post/feed/?limit=20&skip=${pageParam * 20}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.posts;
  };

  const {
    data: followedFeed,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(['followedFeed'], ({ pageParam }) => fetchFollowedFeed({ pageParam }), {
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 20 ? allPages.length : undefined),
    onError: (error) => {
      console.error('Error fetching data:', error);
    },

    onSuccess: (followedFeed) => setCategory(null, followedFeed),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const cachedData = queryClient.getQueryData('followedFeed');
    if (cachedData) {
      setCategory(cachedData);
    } else {
      fetchNextPage();
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      feedCount.current += 1;
      fetchNextPage();
    }
    //eslint-disable-next-line
  }, [inView]);

  return (
    <Layout $isPCScreen={isPCScreen}>
      {!isPCScreen && <MainHeader />}
      <main style={{ paddingBottom: 90 }}>
        <Toggle
          margin='25px 0 0 16px'
          leftButton='국내'
          rightButton='해외'
          setIsLeftToggle={setIsLeftToggle}
          rightOn={!isLeftToggle}
        />
        {isLoading ? (
          <>
            <HomePostSkeleton />
            <HomePostSkeleton />
          </>
        ) : followedFeed?.pages?.length > 0 ? (
          isLeftToggle ? (
            koreaPosts.map((post) => <HomePost key={post.id} post={post} />)
          ) : (
            globalPosts.map((post) => <HomePost key={post.id} post={post} />)
          )
        ) : (
          !isLoading && (
            <Empty image={logo} alt='로고' navigate='/search' buttonName='검색하기'>
              유저를 검색해 팔로우 해보세요!
            </Empty>
          )
        )}
        <div ref={ref}> {isFetchingNextPage && <Spinner />}</div>
      </main>
      <TopButton />
      {isPCScreen || <Navbar />}
      {isPCScreen && <MyPillowings $on={isPCScreen} />}
    </Layout>
  );
};

export default Home;
