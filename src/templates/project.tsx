import React, { useEffect, useState } from 'react'
import { PageProps, graphql, navigate } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import { Flex, Box, Text, Image } from 'rebass/styled-components'
import TextButton from '../components/textButton'
import ReactPlayer from 'react-player'
import { Colour, pageLink } from '../util/constants'
import ProjectGrid from '../components/projectGrid'

const Home = (props: PageProps) => {
  const header: IHome = (props as any).data.dataYaml
  const project: IProject = (props as any).data.projectsYaml
  const initialProjects: IProjectNode[] = (props.data as any).allProjectsYaml
    .edges
  const projectOrder: string[] = (props.data as any).orderYaml.projects
  const pageInfo: IPageInfo = (props.data as any).allProjectsYaml.pageInfo
  const prevSlug = (props.pageContext as any).prev
  const nextSlug = (props.pageContext as any).next
  const [imageFullscreen, setImageFullscreen] = useState<string>('')

  const nextClick = () => {
    if (nextSlug) {
      navigate(`/${nextSlug}`)
    }
  }

  const prevClick = () => {
    if (prevSlug) {
      navigate(`/${prevSlug}`)
    }
  }

  const orderedProjects = (): IProjectNode[] => {
    const ordered: IProjectNode[] = []
    for (const slug of projectOrder) {
      const project = initialProjects.find(x => x.node.slug === slug)
      if (project) {
        ordered.push(project)
      }
    }
    return ordered
  }

  return (
    <Layout pageArea={0} data={header} offMainPage={true}>
      <SEO title={project.title} />
      <Box style={{ height: '120px' }} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr minmax(auto, 1024px) 1fr',
          gridTemplateAreas: '"left center right"',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            gridArea: 'center',
          }}
          mx={[3, 4]}
        >
          <Flex
            justifyContent={['center', 'flex-start']}
            alignItems={'center'}
            flexDirection={['column', 'row']}
            flexWrap={'wrap'}
            mb={[4]}
          >
            <Text fontSize={[6]} fontWeight={[2]} sx={{ lineHeight: '3rem' }}>
              {project.title}.
            </Text>
          </Flex>
          {project.video && (
            <Box
              width={'100%'}
              sx={{ position: 'relative', paddingTop: '56.25%' }}
              mb={[4]}
              bg={Colour.primary}
            >
              <ReactPlayer
                url={project.video}
                style={{ position: 'absolute', top: 0, left: 0 }}
                width={'100%'}
                height={'100%'}
              />
            </Box>
          )}
          {project.body && (
            <Box mb={[4]}>
              <Text dangerouslySetInnerHTML={{ __html: project.body }} />
            </Box>
          )}
          {project.iframe && (
            <Box
              width={1}
              pt={['160%', '100%']}
              sx={{ position: 'relative' }}
              mb={[4]}
            >
              <Box
                as="iframe"
                src={project.iframe}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                width={1}
                height="100%"
              />
            </Box>
          )}
          {project.codePen && (
            <Box
              dangerouslySetInnerHTML={{ __html: project.codePen }}
              mb={[4]}
            />
          )}
          {project.images.length > 0 && (
            <Box mb={[4]}>
              {project.images.map((image, index) => (
                <Image
                  key={`image${index}`}
                  src={image}
                  mb={[2]}
                  width="100%"
                  sx={{
                    cursor: 'zoom-in',
                  }}
                  onClick={() => setImageFullscreen(image)}
                />
              ))}
            </Box>
          )}
          {imageFullscreen && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 500,
                cursor: 'zoom-out',
                overflowY: 'auto',
              }}
              p={[6]}
              onClick={() => setImageFullscreen('')}
            >
              <Image
                src={imageFullscreen}
                sx={{ objectFit: 'contain' }}
                width={1}
              />
            </Box>
          )}
          {orderedProjects().length > 0 && (
            <>
              <Flex mb={[2]} justifyContent={['center', 'flex-start']}>
                <Text fontSize={[4]} color="grey">
                  More Projects
                </Text>
              </Flex>
              <Flex
                justifyContent={'flex-start'}
                alignItems={'center'}
                flexDirection={'row'}
                flexWrap={'wrap'}
                mb={[2]}
              >
                <Box
                  mx={[0]}
                  my={[1]}
                  onClick={() => navigate(`/#${pageLink.work}`)}
                >
                  <TextButton text={'back to work'} active={false} altStyle />
                </Box>
                <Box flex={1} />
                <Box mx={[0]} my={[1]} onClick={prevClick}>
                  <TextButton
                    text={'previous'}
                    active={false}
                    altStyle
                    disabled={!prevSlug}
                  />
                </Box>
                <Box mr={[3]} />
                /
                <Box mr={[3]} />
                <Box mx={[0]} my={[1]} onClick={nextClick}>
                  <TextButton
                    text={'next'}
                    active={false}
                    altStyle
                    disabled={!nextSlug}
                  />
                </Box>
              </Flex>
              <Box>
                <ProjectGrid
                  initialProjects={orderedProjects()}
                  type={project.type as 'all' | 'motion' | 'web' | 'design'}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Box style={{ height: '120px' }} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $type: String!) {
    projectsYaml(slug: { eq: $slug }) {
      slug
      video
      type
      title
      body
      feature
      images
      iframe
      codePen
    }
    orderYaml {
      projects
    }
    allProjectsYaml(filter: { type: { glob: $type }, slug: { ne: $slug } }) {
      edges {
        node {
          slug
          title
          type
          feature
        }
      }
      pageInfo {
        hasNextPage
        totalCount
        perPage
        itemCount
      }
    }
    dataYaml {
      sections {
        title
      }
      logo
    }
  }
`

export default Home
