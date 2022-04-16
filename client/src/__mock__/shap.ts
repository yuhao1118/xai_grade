import { mock } from '@src/utils/common';

export const getSHAPExplaination = () =>
  mock({
    base_value: 0.2588087262443135,
    pred_class: 'A',
    values: [
      0.2550215775681677, 0.2079732998154866, 0.15651832639176927,
      0.0345350956116877, -0.03229074178182815, 0.031894709935374285,
      -0.030015606282301363, 0.026954164592565097, -0.02678902632897517,
      0.009030435403937054,
    ],
    features: [
      'Fjob',
      'G1',
      'G2',
      'studytime',
      'traveltime',
      'Medu',
      'Mjob',
      'failures',
      'paid',
      '23 other features',
    ],
    data: ['teacher', 14.0, 14.0, 3.0, 2.0, 4.0, 'teacher', 0.0, 'yes', null],
  });
