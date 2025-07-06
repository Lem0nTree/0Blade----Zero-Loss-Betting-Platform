import React, {useEffect} from 'react'
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box, Grid} from '@mui/material';



const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


export default function FaqPage() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
        <Box className='faq_page_box'>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Box className='gird_box_one'>
                <Typography component='h3'>Frequently Asked Questions</Typography>
                <Typography component='p'>Find the answers to the most common questions we get asked on a daily basis.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className='faq_page_two'>
                  <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                      <Typography>How is Zero Loss Sports Betting Possible?</Typography>
                      <Box className='bg_img_mains' />
                    </AccordionSummary>
                  <AccordionDetails>
                    <Typography className='p_color'>
                    Zero Loss Sports Betting is possible thanks to the earning opportunities presented by yield farms, such as the ones from our partners at MM.Finance. User funds deposited through bets are accumulated together and sent to a yield farm which will generate yield in a 7 day locking period. The generated yield will be used for the winners’ prize pot, allowing us to refund everyone’s initial assets on both won and lost bets. 
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                      <Typography className='ttle_hedng'>Which Farms will be used to Generate Prize Pots?</Typography>
                      <Box className='bg_img_mains' />
                        
                    </AccordionSummary>
                  <AccordionDetails>
                    <Typography className='p_color'>
                    We will be using MM.Finance farms for the time being, since they have been close to us from launch, and are one of the most (if not the most) reputable projects on the Cronos Chain. It’s also great that most of their farms and staking pools have fantastic returns, which will aid us a lot with the fast growth of our prize pots.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                      <Typography>How Long is the Locking Time?</Typography>
                      <Box className='bg_img_mains' />
                    </AccordionSummary>
                  <AccordionDetails>
                    <Typography className='p_color'>
                    Our baseline of 7 days of locking time remains, but we might also do shorter betting times upon community request, as we assess what the average TVB (Total Value Bet) will be throughout the week.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
                      <Typography>Are the Multipliers Correct?</Typography>
                      <Box className='bg_img_mains' />
                    </AccordionSummary>
                  <AccordionDetails>
                    <Typography className='p_color'>
                    Our multiplier system is quite complicated compared to traditional betting platforms, since the only time we know exactly what the payouts are is when the match is completed and the results are out. They depend a lot on several external factors, such as APR stability, total number of players, total number of winners and which outcomes are victorious. These multiplier values should be intended as a maximum potential payout.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                    <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
                      <Typography>When Can I Claim my Rewards?</Typography>
                      <Box className='bg_img_mains' />
                    </AccordionSummary>
                  <AccordionDetails>
                    <Typography className='p_color'>
                    You will be able to claim your rewards right after a match is completed and the results are out. About 20 minutes of operational timing will be necessary to get everything distributed through the smart contracts, and you’ll be able to check and claim all of your won and lost bets through our Bet History page.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                    <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
                      <Typography>How Frequent Will Matches Be?</Typography>
                      <Box className='bg_img_mains' />
                    </AccordionSummary>
                  <AccordionDetails>
                    <Typography className='p_color'>
                    We are aiming for around 3-5 matches per week during the first weeks, allowing us to ensure that there will be a good amount of TVB distributed between every match featured on our platform. As the platform keeps growing, we will keep scaling this number, adding more matches and more types of sports to the list every single week.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        
    </>
  )
}
