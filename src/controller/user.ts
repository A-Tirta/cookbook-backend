import { Router, Request, Response, NextFunction } from 'express';
import { genSalt, hash, compare } from 'bcryptjs';
import { body, query, validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';

import { prismaClient } from '../config';
import { returnResponse } from '../interface/';
import { prisma } from '@prisma/client';

const router = Router();

let resObject: returnResponse;

router.post(
  '/register',
  body('email').isEmail().isLength({ max: 50 }),
  body('username').isString().isLength({ max: 50 }),
  body('password').isString(),
  body(['first_name', 'last_name']).isString().isLength({ max: 255 }),
  body('status').optional().isString().isLength({ max: 255 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
      try {
        const { id, create_at, update_at, email, username, password, ...body } = req.body;

        const getUserData = await prismaClient.user.findFirst({
          where: {
            OR: [{ email }, { username }],
          },
          select: {
            email: true,
            username: true,
          },
        });

        if (getUserData === null) {
          const salt = await genSalt(10);

          const hashedPassword = await hash(password, salt);

          const createUserData = await prismaClient.user.create({
            data: {
              email,
              username,
              password: hashedPassword,
              ...body,
            },
            select: {
              email: true,
              username: true,
              first_name: true,
              last_name: true,
              status: true,
              create_at: true,
              update_at: true,
            },
          });

          resObject = {
            statuscode: 200,
            data: {
              message: 'Username berhasil dibuat',
              data: createUserData,
            },
          };
        } else {
          resObject = {
            statuscode: 409,
            data: {
              message: 'Username atau Email sudah ada',
              data: getUserData,
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
  }
);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    try {
      const rows = await prismaClient.user.findMany({
        select: {
          email: true,
          username: true,
          first_name: true,
          last_name: true,
          status: true,
          create_at: true,
          update_at: true,
          authors_recepies: {
            select: {
              ingredients: true,
              directions: true,
              author_comments: true,
              posted: true,
              likes: true,
              comments: {
                select: {
                  comments: true,
                },
              },
            },
          },
        },
      });

      resObject = {
        statuscode: 200,
        data: {
          message: 'Data user',
          data: rows,
        },
      };
    } catch (error) {
      resObject = {
        statuscode: 500,
        data: {
          message: 'Ada sesuatu yang salah dari server',
        },
      };
    }
  } else {
    resObject = {
      statuscode: 500,
      data: {
        message: 'Terjadi suatu kesalahan',
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
      const { id }: any = req.params;

      const row = await prismaClient.user.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          email: true,
          username: true,
          first_name: true,
          last_name: true,
          status: true,
          create_at: true,
          update_at: true,
          authors_recepies: {
            select: {
              ingredients: true,
              directions: true,
              author_comments: true,
              posted: true,
              likes: true,
              comments: {
                select: {
                  comments: true,
                },
              },
            },
          },
        },
      });

      resObject = {
        statuscode: 200,
        data: {
          message: 'Data user',
          data: row,
        },
      };
    } catch (error) {
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
        message: 'Terjadi suatu kesalahan',
        info: err.array(),
      },
    };
  }

  return res.status(resObject.statuscode).json(resObject.data);
});

router.put('/ubah_password', body(['email', 'username']).isString().isLength({ max: 50 }), body('password').isString(), async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    try {
      const { email, username, password } = req.body;

      const userValid = await prismaClient.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
        select: {
          id: true,
        },
      });

      if (userValid !== null) {
        const salt = await genSalt(10);

        const hashedPassword = await hash(password, salt);

        await prismaClient.user.update({
          where: {
            id: userValid.id,
          },

          data: {
            password: hashedPassword,
          },
        });
      } else {
        resObject = {
          statuscode: 200,
          data: {
            message: 'Password user berhasil dibuat',
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
});

router.post('/login', body('email').optional().isEmail().isLength({ max: 50 }), body('username').optional().isString().isLength({ max: 50 }), body('password').isString(), async (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    try {
      const { id, email, username, password, ...body } = req.body;

      const getUserTerdaftar = await prismaClient.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
        },
      });

      if (getUserTerdaftar !== null) {
        const validPassword = await compare(password, getUserTerdaftar.password);

        if (validPassword === true) {
          const token = sign(
            {
              id: getUserTerdaftar.id,
            },
            String(process.env.TOKEN),
            {
              expiresIn: '5d',
              algorithm: 'HS256',
            }
          );

          resObject = {
            statuscode: 200,
            data: {
              message: 'User berhasil login',
              info: { token },
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
