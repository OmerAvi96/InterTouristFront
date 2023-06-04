import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import {
  Empty, Layout, List, Menu,
} from 'antd';
import React, { useEffect, useState } from 'react';
import VirtualList from 'rc-virtual-list';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Post from '../components/Chat/Post';
import Poster from '../components/Chat/Poster';
import { postsFetched } from '../redux/actions/postAction';

const { Sider } = Layout;
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit semper facilisis. Etiam in erat et libero ornare ultrices ut vitae ante. Vestibulum ac viverra risus. Nunc ultrices lorem finibus ante pretium, et faucibus ante lacinia. Nullam ut ipsum lectus. Quisque eu eros magna. Donec hendrerit ultricies dictum. Ut gravida sagittis nunc a vestibulum. Donec luctus malesuada mi. Nunc aliquet sed tellus sed consectetur. Suspendisse pellentesque pellentesque tellus a posuere. Nullam lobortis eu libero ut auctor. Nulla facilisi. Morbi sed nisl vitae eros faucibus posuere non vitae odio.';
function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cityId = searchParams.get('cityId');
  const lang = searchParams.get('lang');
  const postState = useSelector((state) => state.post);
  const [processedPosts, setProcessedPosts] = useState([]);

  useEffect(() => {
    if (processedPosts?.length === 0) {
      const processed = postState.posts.map((post) => Post(post));
      setProcessedPosts(processed);
    } else {
      const newPost = Post(postState.posts[postState.posts.length - 1]);
      setProcessedPosts((prev) => [...prev, newPost]);
    }
  }, [postState]);

  useEffect(() => {
    // Send request to server to fetch posts
    try {
      const response = fetch(`${process.env.REACT_APP_API_SERVER}/api/chat/posts/city/${cityId}/${lang}`)
        .then((res) => (res.json()))
        .then((data) => dispatch(postsFetched(data)));
    } catch (e) {
      console.log(e);
    }
  }, [lang, cityId]);
  return (
    <Layout style={{
      backgroundColor: 'lightgreen',
      height: '100vh',
      overflowY: 'hidden',
      width: '-webkit-fill-available',
    }}
    >
      <Sider style={{ padding: 20, marginTop: 50 }}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
            (icon, index) => ({
              key: String(index + 1),
              icon: React.createElement(icon),
              label: `nav ${index + 1}`,
              style: { backgroundColor: 'darkorange' },
            }),
          )}
        />
      </Sider>
      {/* eslint-disable-next-line array-callback-return */}
      {!postState?.posts || postState?.posts.length === 0
        ? <Empty style={{ position: 'relative', top: '50vh' }} />
        : (
          <List
            itemLayout="vertical"
          >
            <VirtualList
              height={window.innerHeight}
              data={processedPosts}
              style={{ marginTop: '50px' }}
            >
              { (item) => (
                <div style={{ padding: '10px 100px 10px 100px' }}>
                  {item}
                </div>
              )}
            </VirtualList>
          </List>
        )}
      <Poster cityId={cityId} lang={lang} />
    </Layout>
  );
}
export default App;
