import { Router, Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { verify } from 'jsonwebtoken';

import { prismaClient } from '../config';
import { returnResponse, token } from '../interface/';
import { tokenConverter } from '../function';
import { prisma } from '@prisma/client';

const router = Router();

let resObject: returnResponse;

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    try {
      const reader: token = tokenConverter(req.headers['authorization']!);

      const userValid = await prismaClient.user.findFirst({
        where: {
          id: reader.id,
        },
        select: {
          id: true,
        },
      });

      if (userValid !== null) {
        const rows = await prismaClient.comments.findMany({
          select: {
            comments: true,
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Get All Comments',
            data: rows,
          },
        };
      } else {
        resObject = {
          statuscode: 404,
          data: {
            message: 'User tidak ditemukan',
          },
        };
      }
    } catch (error) {
      console.log(error);

      resObject = {
        statuscode: 500,
        data: {
          message: 'Ada sesuatu yang salah dari server',
        },
      };
    }
  } else {
    resObject = {
      statuscode: 400,
      data: {
        message: 'Form masih ada yang kurang, coba cek lagi',
        info: err.array(),
      },
    };
  }

  return res.status(resObject.statuscode).json(resObject.data);
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    try {
      const reader: token = tokenConverter(req.headers['authorization']!);

      const userValid = await prismaClient.user.findFirst({
        where: {
          id: reader.id,
        },
        select: {
          id: true,
        },
      });

      if (userValid !== null) {
        const { id }: any = req.params;

        const row = await prismaClient.comments.findUnique({
          where: {
            id: Number(id),
          },
          select: {
            comments: true,
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Get Comment',
            data: row,
          },
        };
      } else {
        resObject = {
          statuscode: 404,
          data: {
            message: 'User tidak ditemukan',
          },
        };
      }
    } catch (error) {
      console.log(error);

      resObject = {
        statuscode: 500,
        data: {
          message: 'Ada sesuatu yang salah dari server',
        },
      };
    }
  } else {
    resObject = {
      statuscode: 400,
      data: {
        message: 'Form masih ada yang kurang, coba cek lagi',
        info: err.array(),
      },
    };
  }

  return res.status(resObject.statuscode).json(resObject.data);
});

router.post('/:id_resep', body('comments').isString(), async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    try {
      const { id, create_at, update_at, comments, ...body } = req.body;
      const reader: token = tokenConverter(req.headers['authorization']!);

      const userValid = await prismaClient.user.findFirst({
        where: {
          id: reader.id,
        },
        select: {
          id: true,
        },
      });

      if (userValid !== null) {
        const { id_resep }: any = req.params;

        const createComments = await prismaClient.comments.create({
          data: {
            comments,
            user_id: {
              connect: {
                id: reader.id,
              },
            },
            recepies_id: {
              connect: {
                id: Number(id_resep),
              },
            },
            ...body,
          },
          select: {
            comments: true,
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Comments berhasil diubah',
            data: createComments,
          },
        };
      } else {
        resObject = {
          statuscode: 404,
          data: {
            message: 'User tidak ditemukan',
          },
        };
      }
    } catch (error) {
      console.log(error);

      resObject = {
        statuscode: 500,
        data: {
          message: 'Ada sesuatu yang salah dari server',
        },
      };
    }
  } else {
    resObject = {
      statuscode: 400,
      data: {
        message: 'Form masih ada yang kurang, coba cek lagi',
        info: err.array(),
      },
    };
  }

  return res.status(resObject.statuscode).json(resObject.data);
});

export default router;
