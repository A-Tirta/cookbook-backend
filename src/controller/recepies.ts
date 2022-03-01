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
        const rows = await prismaClient.recepies.findMany({
          select: {
            ingredients: true,
            directions: true,
            author_comments: true,
            posted: false,
            author_id: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Get All Recepies',
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

        const row = await prismaClient.recepies.findUnique({
          where: {
            id: Number(id),
          },
          select: {
            ingredients: true,
            directions: true,
            author_comments: true,
            posted: false,
            author_id: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Get Recepies',
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

router.post('/buat_resep', body(['ingredients', 'directions']).isString(), body('author_comments').optional().isString(), body('posted').isBoolean(), body('likes').isInt(), async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    try {
      const { id, create_at, update_at, ingredients, directions, author_comments, posted, likes, ...body } = req.body;

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
        const createRecepiest = await prismaClient.recepies.create({
          data: {
            ingredients,
            directions,
            author_comments,
            posted,
            likes,
            author_id: {
              connect: {
                id: reader.id,
              },
            },
            ...body,
          },
          select: {
            ingredients: true,
            directions: true,
            author_comments: true,
            posted: true,
            likes: true,
            author_id: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Get All Recepies',
            data: createRecepiest,
          },
        };
      } else {
        resObject = {
          statuscode: 404,
          data: {
            message: 'User tidak ditemukan atau Password yang dimasukkan salah',
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

router.put('/:id_ubah_resep', async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    try {
      const { id, create_at, update_at, ingredients, directions, author_comments, posted, likes, ...body } = req.body;

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
        const { id_ubah_resep }: any = req.params;

        const updateRecepiest = await prismaClient.recepies.update({
          where: {
            id: Number(id_ubah_resep),
          },

          data: {
            ingredients,
            directions,
            author_comments,
            posted,
            likes,
            author_id: {
              connect: {
                id: reader.id,
              },
            },
            ...body,
          },

          select: {
            ingredients: true,
            directions: true,
            author_comments: true,
            posted: true,
            likes: true,
            author_id: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        });

        resObject = {
          statuscode: 200,
          data: {
            message: 'Recepiest berhasil di update',
            data: updateRecepiest,
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
