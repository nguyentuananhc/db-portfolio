import { motion } from 'framer-motion';
import { GetStaticPropsResult } from 'next';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import BlogTile from '../../components/blog-tile/BlogTile';
import withPageTransition from '../../components/hoc/with-page-transition';
import PageBody from '../../components/page-body/PageBody';
import PageHeader from '../../components/page-header/PageHeader';
import Page from '../../components/page/Page';
import { Post } from '../../models/Post';
import { getPosts } from '../api/posts';

/**
 * Animation variants for the posts container element.
 */
const postsContainerVariants = {
  initial: {
    opacity: 0
  },
  enter: {
    delay: 0.6,
    opacity: 1,
    transition: {
      when: 'beforeChildren'
    }
  }
};

/**
 * Props for {@link PostsPage}.
 */
interface PostsPageProps {
  posts: Post[];
}

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<PostsPageProps>
> => {
  try {
    const posts = await getPosts();
    return {
      props: {
        posts
      }
    };
  } catch (e) {
    console.error('Error while fetch posts: ', e);
  }
};

/**
 * Page that displays a list of blog posts.
 */
const PostsPage: React.FC<PostsPageProps> = ({ posts: initialPosts = [] }) => {
  const [posts, setPosts] = useState(initialPosts);
  const fetchMostPosts = () => {
    console.log('FetchingMore Posts');
  };

  return (
    <>
      <Page>
        <PageHeader
          title="Posts"
          description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi doloribus laudantium nostrum cum atque dolores id sitod voluptate."
        />
        <PageBody>
          <motion.div variants={postsContainerVariants}>
            <InfiniteScroll
              className="flex flex-wrap justify-start -mx-4"
              dataLength={posts.length}
              next={fetchMostPosts}
              hasMore={posts.length < 25}
              loader={null}>
              {posts.map((post) => (
                <BlogTile key={post.id} post={post} />
              ))}
            </InfiniteScroll>
          </motion.div>
        </PageBody>
      </Page>
    </>
  );
};

export default withPageTransition(PostsPage);
