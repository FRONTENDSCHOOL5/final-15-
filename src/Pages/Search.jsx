import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import userToken from 'Recoil/userToken/userToken';
import { Layout } from 'Styles/Layout';
import URL from 'Api/URL';
import { SearchHeader, SearchInput } from 'Components/common/Header/SearchHeader';
import Navbar from 'Components/common/Navbar';
import User from 'Components/common/User';
import UserSkeleton from 'Components/common/Skeleton/UserSkeleton';
import isDesktop from 'Recoil/isDesktop/isDesktop';
import useIsWideView from 'Components/SideNav/useIsWideView';
import MetaTag from 'Components/common/MetaTag';

const Search = ({ setIsSearch, setIconState }) => {
  const token = useRecoilValue(userToken);
  const isPCScreen = useRecoilValue(isDesktop);
  const isWideView = useIsWideView();

  const location = useLocation();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);

  const handleSearchKeyword = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);
  };

  const useDebounceValue = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debounceValue = useDebounceValue(searchKeyword, 750);

  const searchUser = async () => {
    setSearchData([]);
    setShowAllResults(false);
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/user/searchuser/?keyword=${debounceValue}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSearchData(data);
    } catch (error) {
      console.error('에러', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceValue === '') {
      setSearchData([]);
      return;
    }

    searchUser();
    //eslint-disable-next-line
  }, [debounceValue]);

  const handleAllResults = () => {
    setShowAllResults(true);
  };

  const closeModal = () => {
    const path = location.pathname;
    setIsSearch(false);
    setIconState(path.slice(1).charAt(0).toUpperCase() + path.slice(2));
  };

  const SearchContent = () => (
    <SearchContentLayout>
      <ul>
        {isLoading && (
          <>
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
          </>
        )}
        {showAllResults
          ? searchData.map((user) => (
              <SearchedUser key={user._id}>
                <User
                  search
                  keyword={debounceValue}
                  userImg={user.image}
                  username={user.username}
                  content={'@' + user.accountname}
                  accountname={user.accountname}
                  setIsSearch={setIsSearch}
                />
              </SearchedUser>
            ))
          : searchData.slice(0, 9).map((user) => (
              <SearchedUser key={user._id}>
                <User
                  search
                  keyword={debounceValue}
                  userImg={user.image}
                  username={user.username}
                  content={'@' + user.accountname}
                  accountname={user.accountname}
                  setIsSearch={setIsSearch}
                />
              </SearchedUser>
            ))}
        {showAllResults ||
          (searchData.length > 10 && <ShowAllButton onClick={handleAllResults}>결과 모두 보기</ShowAllButton>)}
      </ul>
    </SearchContentLayout>
  );
  return (
    <>
      {isWideView ? (
        <PCBackground onClick={closeModal} isPCScreen={isPCScreen}>
          <PCSearchLayout onClick={(e) => e.stopPropagation()}>
            <SearchInput value={searchKeyword} onChange={handleSearchKeyword} />
            <SearchContent />
          </PCSearchLayout>
        </PCBackground>
      ) : (
        <>
          <MetaTag
            title='Tripillow 검색'
            description='다른 pillower들을 검색하여 다양한 여행 기록과 여행 상품을 살펴보세요'
            url='https://tripillow.netlify.app/search'
          />
          <Layout>
            <SearchHeader value={searchKeyword} onChange={handleSearchKeyword} />
            <SearchContent />
            <Navbar />
          </Layout>
        </>
      )}
    </>
  );
};

const SearchContentLayout = styled.div`
  padding: 20px 16px;
`;

const SearchedUser = styled.li`
  margin-bottom: 16px;
`;

const ShowAllButton = styled.button`
  width: 100%;
  font-size: var(--sm);
  color: var(--primary);
`;

const PCBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: ${(props) => (props.isPCScreen ? '349px' : '83px')};
  z-index: 50;
`;

const PCSearchLayout = styled.article`
  width: 390px;
  position: fixed;
  top: 0;
  height: 100%;
  padding: 16px 16px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.05) 4px 0px 5px;
  box-sizing: border-box;
  animation: fadeInModal 0.5s ease;
  overflow: auto;

  @keyframes fadeInModal {
    from {
      transform: translateX(-60%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

export default Search;
