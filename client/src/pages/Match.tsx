import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, TextField, Checkbox, IconButton, Slider } from '@mui/material';
import { useParams } from 'react-router-dom';
import MatchTabOne from '../component/matchtabs/MatchTabOne';
import CoeffTab from '../component/matchtabs/CoeffTab';
import matchesData from '../data/matches.json';
import CloseIcon from '@mui/icons-material/Close';

export default function Match() {
  const { eventId } = useParams<{ eventId: string }>();
  const [selectedBets, setSelectedBets] = useState<any[]>([
    // Mock selected bets
    {
      id: 1,
      matchName: 'Barcelona vs Real Madrid',
      betType: 'Match Result',
      outcome: 'Barcelona',
      multiplier: 2.5,
      checked: true,
    },
    {
      id: 2,
      matchName: 'Barcelona vs Real Madrid',
      betType: 'Over/Under',
      outcome: 'Over 2.5',
      multiplier: 1.8,
      checked: true,
    },
  ]);
  const [betAmount, setBetAmount] = useState('100');
  const [timePeriod, setTimePeriod] = useState(6); // 2, 6, 12, or 24 months
  const [matchDetails, setMatchDetails] = useState<any>(null);

  useEffect(() => {
    // Find match by ID
    const match = matchesData.find((m) => m.matchID === eventId || m.matchID === '1');
    if (match) {
      setMatchDetails(match);
    } else {
      // Default to first match if not found
      setMatchDetails(matchesData[0]);
    }
  }, [eventId]);

  if (!matchDetails) {
    return <Box>Loading...</Box>;
  }

  const handleBetSelection = (betData: any) => {
    // Add new bet to selected bets
    const newBet = {
      id: Date.now(),
      matchName: matchDetails.matchname,
      betType: betData[2] || 'Bet',
      outcome: betData[1] || 'Outcome',
      multiplier: parseFloat(betData[0]) || 2.0,
      checked: true,
    };
    setSelectedBets([...selectedBets, newBet]);
  };

  const handleRemoveBet = (betId: number) => {
    setSelectedBets(selectedBets.filter((bet) => bet.id !== betId));
  };

  const handleToggleBet = (betId: number) => {
    setSelectedBets(
      selectedBets.map((bet) =>
        bet.id === betId ? { ...bet, checked: !bet.checked } : bet
      )
    );
  };

  const handlePlaceBet = () => {
    const activeBets = selectedBets.filter((bet) => bet.checked);
    const amount = parseFloat(betAmount) || 0;
    if (activeBets.length > 0 && amount > 0) {
      // UI only - no actual betting logic
      alert(`Bet placed: ${activeBets.length} bet(s) - Amount: ${amount} - Time Period: ${getTimePeriodLabel(timePeriod)}`);
    }
  };

  const handleTimePeriodChange = (newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    // Snap to nearest valid value: 2, 6, 12, or 24
    const validValues = [2, 6, 12, 24];
    const closest = validValues.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    setTimePeriod(closest);
  };

  // Calculate potential winning
  const calculatePotentialWinning = () => {
    const activeBets = selectedBets.filter((bet) => bet.checked);
    const amount = parseFloat(betAmount) || 0;
    if (activeBets.length === 0 || amount === 0) return 0;
    
    // For single bet, use its multiplier
    if (activeBets.length === 1) {
      return amount * activeBets[0].multiplier;
    }
    
    // For multiple bets (accumulator), multiply all multipliers
    const totalMultiplier = activeBets.reduce((acc, bet) => acc * bet.multiplier, 1);
    return amount * totalMultiplier;
  };

  // Get time period label
  const getTimePeriodLabel = (months: number) => {
    return `${months} ${months === 1 ? 'Month' : 'Months'}`;
  };

  // Calculate redeemable date based on time period
  const getRedeemableDate = () => {
    const now = new Date();
    const redeemableDate = new Date(now);
    redeemableDate.setMonth(redeemableDate.getMonth() + timePeriod);
    return redeemableDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Calculate betting power based on time period
  const calculateBettingPower = () => {
    // Mock calculation - could be based on time period and amount
    const amount = parseFloat(betAmount) || 0;
    // Example: longer periods might give more power
    const powerMultiplier = timePeriod === 2 ? 1.0 : timePeriod === 6 ? 1.2 : timePeriod === 12 ? 1.5 : 2.0;
    return (amount * powerMultiplier).toFixed(2);
  };

  // Helper function to get team logo
  const getTeamLogo = (teamName: string, isFirst: boolean) => {
    const teamLower = teamName.toLowerCase();
    if (teamLower.includes('barcelona')) {
      return isFirst ? 'img/baclona_logo.svg' : 'img/baclona_logo.svg';
    }
    if (teamLower.includes('real madrid')) {
      return 'img/real_medrid.svg';
    }
    if (teamLower.includes('chelsea')) {
      return 'img/chelsea_logo.svg';
    }
    if (teamLower.includes('manchester')) {
      return 'img/manchester_logo.svg';
    }
    if (teamLower.includes('liverpool')) {
      return 'img/liverpool_logo.svg';
    }
    if (teamLower.includes('psg')) {
      return 'img/psg_logo.svg';
    }
    if (teamLower.includes('sevilla')) {
      return 'img/sevilla_logo.svg';
    }
    // Default to participant image
    return `img/participants/${teamName}_${matchDetails.matchcategory}.png`;
  };

  const getLeagueName = (category: string) => {
    const leagues: { [key: string]: string } = {
      '0': 'La Liga',
      '1': 'UFC Championship',
      '3': 'ATP Tour',
    };
    return leagues[category] || 'League Match';
  };

  const formatMatchDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box className="pdding0_15_respncv">
            <Box className="spain_primira_box">
              <Box className="spain_primira_head">
                <Typography component="p">{getLeagueName(matchDetails.matchcategory)}</Typography>
                <Typography component="h4">{matchDetails.matchname}</Typography>
              </Box>
              <Box className="match_logo_bx">
                <Box className="volkski_img_prnt" style={{ marginBottom: '10px' }}>
                  <Box 
                    component="img" 
                    src={getTeamLogo(matchDetails.matchpartecipant[0], true)} 
                    alt="" 
                    onError={(e: any) => {
                      e.target.src = `img/participants/${matchDetails.matchpartecipant[0]}_${matchDetails.matchcategory}.png`;
                    }}
                  />
                </Box>
                <Typography component="p">{matchDetails.matchpartecipant[0]}</Typography>
                <Box className="cro_flex" style={{ marginTop: '15px', marginBottom: '15px' }}>
                  <Box component="img" src="img/cronosports.svg" alt="" />
                  <Typography component="h5">
                    <span>VS</span>
                  </Typography>
                  <Box component="img" src="img/cronosports.svg" alt="" />
                </Box>
                <Box className="korianzombi_img_prnt" style={{ marginTop: '10px' }}>
                  <Box 
                    component="img" 
                    src={getTeamLogo(matchDetails.matchpartecipant[1], false)} 
                    alt="" 
                    onError={(e: any) => {
                      e.target.src = `img/participants/${matchDetails.matchpartecipant[1]}_${matchDetails.matchcategory}.png`;
                    }}
                  />
                </Box>
                <Typography component="p">{matchDetails.matchpartecipant[1]}</Typography>
              </Box>
            </Box>

            <Box className="match_tabs_section" style={{ marginTop: '30px' }}>
              <MatchTabOne matchDetails={matchDetails} />
            </Box>

            <Box className="coefficients_box">
              <Typography component="h3" style={{ padding: '0 30px', marginBottom: '20px' }}>
                Betting Options
              </Typography>
              <CoeffTab matchDetails={matchDetails} sendToMatch={handleBetSelection} />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="pdding0_15_respncv">
            <Box className="single_bet_box" style={{ marginBottom: '20px' }}>
              <Box className="head_txt_clean_img" style={{ marginBottom: '20px' }}>
                <Typography component="h3">Bet Slip</Typography>
                <Box component="img" src="img/cleaner_ic.svg" alt="" />
              </Box>

              {selectedBets.length > 0 ? (
                <>
                  <Box style={{ marginBottom: '20px' }}>
                    {selectedBets.map((bet) => (
                      <Box key={bet.id} className="single_bet_inn01" style={{ marginBottom: '15px' }}>
                        <Box className="check_text_flex_box">
                          <Checkbox
                            checked={bet.checked}
                            onChange={() => handleToggleBet(bet.id)}
                            sx={{
                              color: 'rgba(0, 213, 125, 1)',
                              '&.Mui-checked': {
                                color: 'rgba(0, 213, 125, 1)',
                              },
                            }}
                          />
                          <Typography component="p">{bet.matchName}</Typography>
                          <IconButton
                            onClick={() => handleRemoveBet(bet.id)}
                            sx={{ minWidth: 0, padding: 0 }}
                          >
                            <CloseIcon sx={{ fontSize: 18, color: '#5d6673' }} />
                          </IconButton>
                        </Box>
                        <Box className="outcom_flex_bx">
                          <Box className="outcom_left">
                            <Typography component="h5">
                              {bet.betType} <span>• {bet.outcome}</span>
                            </Typography>
                          </Box>
                          <Typography component="h6">{bet.multiplier.toFixed(2)}x</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Box className="single_bet_bttm_box">
                    <Box style={{ paddingTop: '15px', paddingBottom: '15px', borderBottom: '1px solid #222831', marginBottom: '15px' }}>
                      <Typography component="h5" style={{ marginBottom: '15px', fontWeight: 600, fontSize: '18px', lineHeight: '22px', color: '#ffffff' }}>
                        Bet Amount
                      </Typography>
                      <Typography component="p" style={{ marginBottom: '10px', fontWeight: 500, fontSize: '14px', lineHeight: '18px', color: '#5d6673' }}>
                        Underlying Asset Amount
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <Box style={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
                              <Box
                                component="img"
                                src={`img/tokens/${(matchDetails?.farmtoken || 'FRAX').toLowerCase()}.svg`}
                                alt=""
                                onError={(e: any) => {
                                  e.target.src = 'img/frax_ic.svg';
                                }}
                                style={{ width: '24px', height: '24px', marginRight: '8px' }}
                              />
                              <Typography component="span" style={{ color: '#ffffff', fontWeight: 600, fontSize: '14px' }}>
                                {matchDetails?.farmtoken || 'FRAX'}
                              </Typography>
                            </Box>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#282e38',
                            borderRadius: '8px',
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: '#323a46',
                            },
                            '&:hover fieldset': {
                              borderColor: '#00d57d',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00d57d',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#ffffff',
                            padding: '12px 14px',
                          },
                        }}
                      />
                    </Box>

                    <Box className="slidr_flex_box">
                      <Box className="num_flex">
                        <Typography component="h5">Underlying Future Yield Lock</Typography>
                        <Typography component="h5">{getTimePeriodLabel(timePeriod)}</Typography>
                      </Box>
                      <Slider
                        value={timePeriod}
                        onChange={(e, newValue) => handleTimePeriodChange(newValue)}
                        min={2}
                        max={24}
                        step={1}
                        marks={[
                          { value: 2, label: '2M' },
                          { value: 6, label: '6M' },
                          { value: 12, label: '12M' },
                          { value: 24, label: '24M' },
                        ]}
                        sx={{
                          marginTop: '15px',
                          '& .MuiSlider-rail': {
                            background: '#222831',
                          },
                          '& .MuiSlider-track': {
                            background: 'rgba(0, 213, 125, 0.2)',
                            border: 'none',
                          },
                          '& .MuiSlider-thumb': {
                            width: 32,
                            height: 32,
                            background: '#00d57d',
                            boxShadow: 'none',
                          },
                          '& .MuiSlider-markLabel': {
                            color: '#5d6673',
                            fontSize: '12px',
                            fontWeight: 600,
                          },
                          '& .MuiSlider-mark': {
                            backgroundColor: '#5d6673',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                          },
                          '& .MuiSlider-markActive': {
                            backgroundColor: '#00d57d',
                          },
                        }}
                      />
                    </Box>

                    <Box className="bet_bttm_cnter_bx">
                      <Box className="bttm_cnter_row">
                        <Typography component="p">Betting Power</Typography>
                        <Typography component="p">{calculateBettingPower()} {matchDetails?.farmtoken || 'FRAX'}</Typography>
                      </Box>
                      <Box className="bttm_cnter_row">
                        <Typography component="p">Potential Winning</Typography>
                        <Typography component="p" style={{ color: '#00d57d' }}>
                          {calculatePotentialWinning().toFixed(2)} {matchDetails?.farmtoken || 'FRAX'}
                        </Typography>
                      </Box>
                      <Box className="bttm_cnter_row">
                        <Typography component="p">Payout</Typography>
                        <Typography component="p">
                          {parseFloat(betAmount) > 0 
                            ? (((calculatePotentialWinning() - parseFloat(betAmount)) / parseFloat(betAmount)) * 100).toFixed(1)
                            : '0.0'}%
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          marginTop: '20px',
                          marginBottom: '15px',
                          padding: '16px',
                          background: 'linear-gradient(135deg, rgba(0, 213, 125, 0.12) 0%, rgba(0, 213, 125, 0.06) 100%)',
                          border: '1px solid rgba(0, 213, 125, 0.2)',
                          borderRadius: '12px',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '4px',
                            height: '100%',
                            background: '#00d57d',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <Box
                            component="img"
                            src="img/i_140_img_ppup.svg"
                            alt=""
                            sx={{
                              width: '20px',
                              height: '20px',
                              marginTop: '2px',
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              component="p"
                              sx={{
                                fontWeight: 600,
                                fontSize: '14px',
                                lineHeight: '20px',
                                color: '#ffffff',
                                marginBottom: '8px',
                              }}
                            >
                              By placing this bet, you agree to bet your future yield on your RWA asset.
                            </Typography>
                            <Typography
                              component="p"
                              sx={{
                                fontWeight: 400,
                                fontSize: '13px',
                                lineHeight: '18px',
                                color: '#9ca3af',
                              }}
                            >
                              In case of a lost bet, you will receive the underlying RWA asset with a redeemable date on Pendle on{' '}
                              <Box
                                component="span"
                                sx={{
                                  color: '#00d57d',
                                  fontWeight: 600,
                                }}
                              >
                                {getRedeemableDate()}
                              </Box>
                              {' '}(based on your {getTimePeriodLabel(timePeriod).toLowerCase()} future yield lock period).
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        onClick={handlePlaceBet}
                        disabled={selectedBets.filter((b) => b.checked).length === 0 || parseFloat(betAmount) === 0}
                        sx={{
                          height: '48px',
                          background: '#00d57d',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '18px',
                          color: '#ffffff',
                          marginTop: '15px',
                          '&:disabled': {
                            background: '#5d6673',
                            color: '#ffffff',
                          },
                        }}
                      >
                        Place Bet
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box className="nobet_bx">
                  <Box component="img" src="img/allert_ic.svg" alt="" />
                  <Typography component="p">No bets selected. Select a bet option to add to your bet slip.</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

