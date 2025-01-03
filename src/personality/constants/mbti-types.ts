// Extraversion (E) vs Introversion (I)
export const EI_THRESHOLD = 0;
export const E_TYPE = 'E';
export const I_TYPE = 'I';

// Sensing (S) vs Intuition (N)
export const SN_THRESHOLD = 0;
export const S_TYPE = 'S';
export const N_TYPE = 'N';

// Thinking (T) vs Feeling (F)
export const TF_THRESHOLD = 0;
export const T_TYPE = 'T';
export const F_TYPE = 'F';

// Judging (J) vs Perceiving (P)
export const JP_THRESHOLD = 0;
export const J_TYPE = 'J';
export const P_TYPE = 'P';

// Function to determine MBTI type based on numerical values
export function getMBTIType(personality: {
  extroversionIntroversion: number;
  sensingIntuition: number;
  thinkingFeeling: number;
  judgingPerceiving: number;
}): string {
  const ei =
    personality.extroversionIntroversion > EI_THRESHOLD ? E_TYPE : I_TYPE;
  const sn = personality.sensingIntuition > SN_THRESHOLD ? S_TYPE : N_TYPE;
  const tf = personality.thinkingFeeling > TF_THRESHOLD ? T_TYPE : F_TYPE;
  const jp = personality.judgingPerceiving > JP_THRESHOLD ? J_TYPE : P_TYPE;

  return `${ei}${sn}${tf}${jp}`;
}
