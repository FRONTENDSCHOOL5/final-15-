import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { LayoutStyle } from '../../Styles/Layout';
import Comment from '../../Components/Comment/Comment';
import PostComment from '../../Components/common/PostComment';
import BasicHeader from '../../Components/common/Header/BasicHeader';
import PostDetailAPI from '../../Utils/PostDetailAPI';
import GetNumerousCommentAPI from '../../Utils/GetNumerousCommentAPI';
import HomePostLayout from '../../Components/HomePost/HomePostLayout';
import MyInfoAPI from '../../Utils/MyInfoAPI';
import { useRecoilValue } from 'recoil';
import isDesktop from '../../Recoil/isDesktop/isDesktop';
import MyPillowings from '../../Components/Home/MyPillowings';

const PostDetail = () => {
  const { id } = useParams();
  const postId = id;
  const isPCScreen = useRecoilValue(isDesktop);
  const [myInfo, setMyInfo] = useState({});
  const updateMyInfo = (data) => {
    setMyInfo(data);
  };
  const [postInfo, setPostInfo] = useState({});
  const updatePostInfo = (data) => {
    setPostInfo(data);
  };
  const [comments, setComments] = useState([]);
  const updateComments = (data) => {
    setComments(data);
  };
  const postDetail = PostDetailAPI(postId, updatePostInfo);
  const { getUserData } = MyInfoAPI(null, updateMyInfo);
  const getNumerousComment = GetNumerousCommentAPI(postId, updateComments);
  const [visibleComments, setVisibleComments] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [isNewComment, setIsNewComment] = useState(false);

  useEffect(() => {
    const sync = async () => {
      await getUserData();
      await postDetail();
      await getNumerousComment();
      setComments((prev) => prev.reverse());
    };
    sync();
  }, []);

  useEffect(() => {
    const sync = async () => {
      // await postDetail();
      await getNumerousComment();
      setComments((prev) => prev.reverse());
    };
    sync();
  }, [isNewComment]);

  useEffect(() => {
    const initialStartIndex = Math.max(comments.length - 5, 0);
    setStartIndex(initialStartIndex);
    setVisibleComments(comments.slice(initialStartIndex));
    if (comments.length > 5) {
      setShowMore(true);
    }
  }, [comments]);

  const handleShowMore = () => {
    const nextStartIndex = Math.max(startIndex - 5, 0);
    const nextVisibleComments = comments.slice(nextStartIndex, startIndex);
    setVisibleComments([...nextVisibleComments, ...visibleComments]);
    setStartIndex(nextStartIndex);

    if (nextStartIndex === 0) {
      setShowMore(false);
    }
  };

  return (
    <Layout $isPCScreen={isPCScreen}>
      {!isPCScreen && (
        <BasicHeader
          btn1='설정 및 개인정보'
          btn2='로그아웃'
          txt='정말 로그아웃 하시겠습니까?'
          rightbtn='로그아웃'
          isPost
        ></BasicHeader>
      )}
      <main>
        <section>
          {Object.keys(postInfo).length > 0 && (
            <HomePostLayout post={postInfo.post} comments={comments}></HomePostLayout>
          )}
        </section>
        <CommentLayout>
          {showMore && <MoreComment onClick={handleShowMore}>더보기</MoreComment>}
          {visibleComments.map((el, i) => (
            <Comment key={i} postId={postId} commentInfo={el} setIsNewComment={setIsNewComment}></Comment>
          ))}
        </CommentLayout>
      </main>
      <PostComment setIsNewComment={setIsNewComment} postId={postId} userImg={myInfo.image}></PostComment>
      {isPCScreen && <MyPillowings $on={isPCScreen} />}
    </Layout>
  );
};

const Layout = styled.div`
  ${LayoutStyle};
  background-color: #fff;
`;

const MoreComment = styled.button`
  color: var(--gray);
  font-size: var(--xs);
  display: block;
  margin: 0 auto 10px;
`;

const CommentLayout = styled.section`
  padding-bottom: 75px;
`;

export default PostDetail;
